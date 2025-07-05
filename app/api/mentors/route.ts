import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { loadAllMentors } from '@/lib/csv-loader';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    
    // Pagination parameters
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;
    
    // Search and filter parameters
    const search = searchParams.get('search') || '';
    const state = searchParams.get('state') || '';
    const company = searchParams.get('company') || '';
    const jobTitle = searchParams.get('jobTitle') || '';
    const yearsExperience = searchParams.get('yearsExperience') || '';
    
    // Try to get mentors from database first
    let mentors = [];
    let totalCount = 0;
    let useFallback = false;
    
    try {
      // Check if mentors table exists and has data
      const { data: tableCheck, error: tableError } = await supabase
        .from('mentors')
        .select('id')
        .limit(1);
      
      if (tableError || !tableCheck || tableCheck.length === 0) {
        // Table doesn't exist or is empty, use CSV fallback
        useFallback = true;
      } else {
        // Table exists and has data, query it
        let query = supabase
          .from('mentors')
          .select('*', { count: 'exact' });
        
        // Apply search filter
        if (search) {
          query = query.or(`name.ilike.%${search}%,company.ilike.%${search}%,job_title.ilike.%${search}%`);
        }
        
        // Apply filters
        if (state) {
          query = query.eq('state', state);
        }
        
        if (company) {
          query = query.ilike('company', `%${company}%`);
        }
        
        if (jobTitle) {
          query = query.ilike('job_title', `%${jobTitle}%`);
        }
        
        if (yearsExperience) {
          // Handle years experience filtering
          if (yearsExperience === '<5') {
            query = query.lt('years_experience', '5');
          } else if (yearsExperience === '5-10') {
            query = query.gte('years_experience', '5').lt('years_experience', '10');
          } else if (yearsExperience === '10+') {
            query = query.gte('years_experience', '10');
          }
        }
        
        // Apply pagination
        query = query.range(offset, offset + limit - 1);
        
        // Execute query
        const { data, error, count } = await query;
        
        if (error) {
          console.error('Database query error:', error);
          useFallback = true;
        } else {
          mentors = data || [];
          totalCount = count || 0;
        }
      }
    } catch (dbError) {
      console.error('Database connection error:', dbError);
      useFallback = true;
    }
    
    // Fallback to CSV loading if database fails or is empty
    if (useFallback) {
      console.log('Using CSV fallback for mentors');
      try {
        const allMentors = await loadAllMentors();
        console.log(`CSV fallback loaded ${allMentors.length} total mentors`);
        
        // Apply filters to CSV data
        let filteredMentors = allMentors;
        
        if (search) {
          const searchLower = search.toLowerCase();
          filteredMentors = filteredMentors.filter(m => 
            m.name?.toLowerCase().includes(searchLower) ||
            m.company?.toLowerCase().includes(searchLower) ||
            m.jobTitle?.toLowerCase().includes(searchLower)
          );
          console.log(`After search filter: ${filteredMentors.length} mentors`);
        }
        
        if (state) {
          filteredMentors = filteredMentors.filter(m => m.state === state);
          console.log(`After state filter: ${filteredMentors.length} mentors`);
        }
        
        if (company) {
          const companyLower = company.toLowerCase();
          filteredMentors = filteredMentors.filter(m => 
            m.company?.toLowerCase().includes(companyLower)
          );
          console.log(`After company filter: ${filteredMentors.length} mentors`);
        }
        
        if (jobTitle) {
          const jobLower = jobTitle.toLowerCase();
          filteredMentors = filteredMentors.filter(m => 
            m.jobTitle?.toLowerCase().includes(jobLower)
          );
          console.log(`After job title filter: ${filteredMentors.length} mentors`);
        }
        
        if (yearsExperience) {
          // Simple filtering for years experience
          filteredMentors = filteredMentors.filter(m => {
            const years = parseInt(m.yearsExperience || '0');
            if (yearsExperience === '<5') return years < 5;
            if (yearsExperience === '5-10') return years >= 5 && years < 10;
            if (yearsExperience === '10+') return years >= 10;
            return true;
          });
          console.log(`After years experience filter: ${filteredMentors.length} mentors`);
        }
        
        totalCount = filteredMentors.length;
        
        // Apply pagination
        mentors = filteredMentors.slice(offset, offset + limit);
        console.log(`After pagination: returning ${mentors.length} mentors (page ${page}, limit ${limit})`);
        
      } catch (csvError) {
        console.error('CSV fallback error:', csvError);
        return NextResponse.json({ error: 'Failed to load mentors' }, { status: 500 });
      }
    }
    
    return NextResponse.json({
      mentors: mentors || [],
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
        hasNext: offset + limit < totalCount,
        hasPrev: page > 1
      }
    });
    
  } catch (error) {
    console.error('Error in mentors API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 