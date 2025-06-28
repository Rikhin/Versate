"use client"

import { BackgroundGradient, FloatingShapes, TextFade } from "@/components/scroll-animations"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, Palette, Type } from "lucide-react"
import Link from "next/link"

export default function AnimationsDemoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 relative overflow-hidden">
      {/* Background Animations */}
      <BackgroundGradient 
        startColor="from-blue-50/50" 
        endColor="to-purple-50/50" 
        triggerStart="top center"
        triggerEnd="center center"
      />
      <FloatingShapes 
        count={8} 
        triggerStart="top center"
        triggerEnd="bottom center"
      />

      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm relative z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-8 w-8 text-purple-600" />
            <div>
              <span className="text-2xl font-bold text-slate-800">Animation Demo</span>
              <p className="text-xs text-slate-500 -mt-1">Scroll-triggered animations</p>
            </div>
          </div>
          <Link href="/">
            <Button variant="outline">Back to Home</Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center relative">
        <TextFade triggerStart="top 80%" triggerEnd="center center" stagger={0.2}>
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-slate-800 mb-6">
              Smooth Scroll
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                {" "}
                Animations
              </span>
            </h1>
            <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
              Experience elegant, performance-optimized scroll-triggered animations built with Lenis and GSAP.
              Lightweight and beautiful, just like Apple product pages.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8 py-3">
                Explore Animations
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </TextFade>
      </section>

      {/* Animation Examples */}
      <section className="container mx-auto px-4 py-16 relative">
        <BackgroundGradient 
          startColor="from-green-50/30" 
          endColor="to-blue-50/30" 
          triggerStart="top center"
          triggerEnd="bottom center"
        />
        
        <TextFade triggerStart="top 80%" triggerEnd="bottom 20%" stagger={0.15}>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">Animation Components</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Three reusable animation components for creating beautiful scroll experiences
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Background Gradient */}
            <Card className="hover:shadow-lg transition-shadow relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 opacity-0 hover:opacity-100 transition-opacity duration-300" />
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Palette className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle>Background Gradient</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Subtle gradient backgrounds that fade in and transform as you scroll. Perfect for adding depth and visual interest to sections.
                </CardDescription>
                <div className="mt-4 text-sm text-slate-500">
                  <strong>Props:</strong> startColor, endColor, triggerStart, triggerEnd
                </div>
              </CardContent>
            </Card>

            {/* Floating Shapes */}
            <Card className="hover:shadow-lg transition-shadow relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-pink-50/50 opacity-0 hover:opacity-100 transition-opacity duration-300" />
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Sparkles className="h-6 w-6 text-purple-600" />
                  </div>
                  <CardTitle>Floating Shapes</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Geometric shapes that float and rotate as you scroll. Creates a dynamic, modern feel without overwhelming the content.
                </CardDescription>
                <div className="mt-4 text-sm text-slate-500">
                  <strong>Props:</strong> count, triggerStart, triggerEnd
                </div>
              </CardContent>
            </Card>

            {/* Text Fade */}
            <Card className="hover:shadow-lg transition-shadow relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 to-blue-50/50 opacity-0 hover:opacity-100 transition-opacity duration-300" />
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Type className="h-6 w-6 text-green-600" />
                  </div>
                  <CardTitle>Text Fade</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Text elements that fade in with stagger effects as they enter the viewport. Great for headlines, stats, and content sections.
                </CardDescription>
                <div className="mt-4 text-sm text-slate-500">
                  <strong>Props:</strong> stagger, triggerStart, triggerEnd
                </div>
              </CardContent>
            </Card>
          </div>
        </TextFade>
      </section>

      {/* Usage Examples */}
      <section className="container mx-auto px-4 py-16 relative">
        <BackgroundGradient 
          startColor="from-purple-50/40" 
          endColor="to-pink-50/40" 
          triggerStart="top center"
          triggerEnd="bottom center"
        />
        
        <TextFade triggerStart="top 80%" triggerEnd="bottom 20%" stagger={0.1}>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">Usage Examples</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              See how to implement these animations in your components
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Code Example 1 */}
            <Card className="bg-slate-900 text-slate-100">
              <CardHeader>
                <CardTitle className="text-slate-100">Basic Background Gradient</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="text-sm overflow-x-auto">
{`<BackgroundGradient 
  startColor="from-blue-50/50" 
  endColor="to-purple-50/50" 
  triggerStart="top center"
  triggerEnd="center center"
/>`}
                </pre>
              </CardContent>
            </Card>

            {/* Code Example 2 */}
            <Card className="bg-slate-900 text-slate-100">
              <CardHeader>
                <CardTitle className="text-slate-100">Text with Stagger</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="text-sm overflow-x-auto">
{`<TextFade 
  triggerStart="top 80%" 
  triggerEnd="bottom 20%" 
  stagger={0.2}
>
  <h1>Your Content</h1>
  <p>More content...</p>
</TextFade>`}
                </pre>
              </CardContent>
            </Card>

            {/* Code Example 3 */}
            <Card className="bg-slate-900 text-slate-100">
              <CardHeader>
                <CardTitle className="text-slate-100">Floating Shapes</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="text-sm overflow-x-auto">
{`<FloatingShapes 
  count={5} 
  triggerStart="top center"
  triggerEnd="bottom center"
/>`}
                </pre>
              </CardContent>
            </Card>

            {/* Code Example 4 */}
            <Card className="bg-slate-900 text-slate-100">
              <CardHeader>
                <CardTitle className="text-slate-100">Combined Animations</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="text-sm overflow-x-auto">
{`<section className="relative">
  <BackgroundGradient />
  <FloatingShapes />
  <TextFade>
    <h2>Your Section</h2>
  </TextFade>
</section>`}
                </pre>
              </CardContent>
            </Card>
          </div>
        </TextFade>
      </section>

      {/* Performance Notes */}
      <section className="container mx-auto px-4 py-16 relative">
        <TextFade triggerStart="top 80%" triggerEnd="bottom 20%" stagger={0.1}>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">Performance Optimized</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Built with performance in mind for smooth 60fps animations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-blue-600 mb-2">60fps</div>
                <p className="text-slate-600">Smooth animations using requestAnimationFrame</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-green-600 mb-2">Lenis</div>
                <p className="text-slate-600">Buttery smooth scrolling with momentum</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-purple-600 mb-2">GSAP</div>
                <p className="text-slate-600">Professional-grade animation library</p>
              </CardContent>
            </Card>
          </div>
        </TextFade>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white/80 backdrop-blur-sm relative z-10">
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-slate-600">
            Animation components built with Lenis, GSAP, and React. 
            <br />
            Designed for performance and elegance.
          </p>
        </div>
      </footer>
    </div>
  )
} 