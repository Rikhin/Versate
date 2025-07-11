"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import Papa from "papaparse";

// 1. Update OnboardingFormData to include new fields
interface OnboardingFormData {
  firstName: string;
  lastName: string;
  age: number | '';
  city: string;
  educationLevel: string;
  educationDetail: string;
  interests: string[];
}

export function OnboardingForm() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<OnboardingFormData>({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    age: '',
    city: '',
    educationLevel: '',
    educationDetail: '',
    interests: [],
  });
  const [cityOptions, setCityOptions] = useState<string[]>([]);
  const [cityInput, setCityInput] = useState('');
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const totalSteps = 5;

  // Auto-save to localStorage
  useEffect(() => {
    localStorage.setItem('onboarding-progress', JSON.stringify({ formData, currentStep }));
  }, [formData, currentStep]);
  useEffect(() => {
    const saved = localStorage.getItem('onboarding-progress');
    if (saved) {
      const { formData: savedData, currentStep: savedStep } = JSON.parse(saved);
      setFormData(savedData);
      setCurrentStep(savedStep);
    }
  }, []);

  // City autocomplete loader
  useEffect(() => {
    fetch('/uscities.csv')
      .then(res => res.text())
      .then(text => {
        const { data } = Papa.parse(text, { header: true, skipEmptyLines: true });
        setCityOptions(
          (data as Array<Record<string, string>>)
            .map(row => `${row.city}, ${row.state_name}`)
            .filter(Boolean)
        );
      });
  }, []);

  if (!isLoaded || !user) return <div>Loading...</div>;

  // Slide validation
  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return true;
      case 2:
        return formData.firstName.trim().length > 0 && formData.lastName.trim().length > 0 && Number(formData.age) >= 13 && Number(formData.age) <= 100;
      case 3:
        return formData.city.trim().length > 0;
      case 4:
        return formData.educationLevel.trim().length > 0;
      case 5:
        return formData.interests.length > 0;
      default:
        return false;
    }
  };

  // Navigation
  const handleNext = () => {
    if (currentStep < totalSteps && isStepValid()) setCurrentStep(s => s + 1);
    if (currentStep === totalSteps && isStepValid()) handleSubmit();
  };

  // Submit handler
  const handleSubmit = async () => {
    try {
      const response = await fetch("/api/profiles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.id,
          first_name: formData.firstName,
          last_name: formData.lastName,
          age: formData.age,
          city: formData.city,
          education_level: formData.educationLevel,
          education_detail: formData.educationDetail,
          interests: formData.interests,
          email: user.emailAddresses?.[0]?.emailAddress || '',
        }),
      });
      if (response.ok) router.push("/dashboard");
      else {
        let errMsg = "Failed to save profile";
        try {
          const err = await response.json();
          errMsg = err.error || errMsg;
        } catch {
          try {
            errMsg = await response.text();
          } catch {}
        }
        console.error("Profile save error:", errMsg);
        alert(errMsg);
      }
    } catch {
      alert("Failed to save profile");
    }
  };

  // Replace the outer container and slide wrappers with a full-screen, flex-centered layout
  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center bg-white px-4">
      <div className="w-full max-w-lg flex flex-col gap-12">
        {/* Versate logo and name above progress bar for steps 2-5 */}
        {currentStep > 1 && (
          <div className="flex justify-center mb-2 w-full">
            <span className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent" style={{ WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Versate
            </span>
              </div>
        )}
        {/* Progress bar */}
        <div className="w-full flex items-center mb-8">
          <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden mr-2">
            <div className="h-1 bg-black rounded-full transition-all duration-300" style={{ width: `${(currentStep-1)/4*100}%` }} />
            </div>
          <span className="text-sm text-gray-400 font-medium">{currentStep}/5</span>
              </div>
        {/* Slide content */}
        <div className="w-full flex flex-col gap-10 animate-fadein">
                {currentStep === 1 && (
            <div className="flex flex-col items-center gap-8">
              <h1 className="text-3xl font-bold text-black tracking-tight">Welcome to Versate!</h1>
              <p className="text-gray-500 text-center max-w-md text-lg">Let&apos;s get to know you. This quick questionnaire will personalize your experience.</p>
              <button className="mt-6 px-10 py-3 border border-black text-black rounded-lg font-semibold bg-white hover:bg-gray-100 transition text-lg" onClick={() => setCurrentStep(2)}>Let&apos;s Begin</button>
                        </div>
          )}
          {currentStep === 2 && (
            <div className="flex flex-col gap-10">
              <div className="flex flex-col gap-8">
                <div className="flex gap-4">
                  <label className="flex-1 text-black font-semibold text-lg">First Name
                    <input
                      type="text"
                      className="mt-3 w-full px-5 py-4 border border-black rounded-xl bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black transition text-lg"
                      placeholder="First name"
                      value={formData.firstName}
                      onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                      required
                    />
                  </label>
                  <label className="flex-1 text-black font-semibold text-lg">Last Name
                    <input
                      type="text"
                      className="mt-3 w-full px-5 py-4 border border-black rounded-xl bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black transition text-lg"
                      placeholder="Last name"
                      value={formData.lastName}
                      onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                      required
                    />
                  </label>
                    </div>
                <label className="text-black font-semibold text-lg">Age
                  <input
                    type="number"
                    min={13}
                    max={100}
                    className="mt-3 w-full px-5 py-4 border border-black rounded-xl bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black transition text-lg"
                    placeholder="Your age"
                    value={formData.age}
                    onChange={e => {
                      const val = e.target.value;
                      setFormData({ ...formData, age: val === '' ? '' : Number(val) });
                    }}
                    required
                  />
                  <span className="text-xs text-gray-400 mt-1 block">Age must be between 13 and 100</span>
                </label>
                      </div>
              <div className="flex justify-between items-center mt-2">
                <button className="text-black border border-black rounded-lg px-8 py-3 bg-white hover:bg-gray-100 transition text-lg" onClick={() => setCurrentStep(1)}>Back</button>
                <button className="text-black border border-black rounded-lg px-8 py-3 bg-white hover:bg-gray-100 transition text-lg disabled:opacity-40" onClick={handleNext} disabled={!formData.firstName || !formData.lastName || !formData.age}>Next</button>
                      </div>
                    </div>
                  )}
          {/* Repeat similar minimalist, full-width, spaced-out styling for steps 3, 4, 5 */}
          {currentStep === 3 && (
            <div className="flex flex-col gap-10">
              <div className="flex flex-col gap-8">
                <label className="text-black font-semibold text-lg">City
                  <div className="relative w-full">
                    <input
                      type="text"
                      className="mt-3 w-full px-5 py-4 border border-black rounded-xl bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black transition text-lg"
                      placeholder="Start typing your city..."
                      value={cityInput}
                      onChange={e => {
                        setCityInput(e.target.value);
                        setShowCityDropdown(true);
                        setFormData({ ...formData, city: e.target.value });
                      }}
                      onFocus={() => setShowCityDropdown(true)}
                      onBlur={() => setTimeout(() => setShowCityDropdown(false), 100)}
                      required
                      autoComplete="off"
                    />
                    {showCityDropdown && cityInput && (
                      <div className="absolute left-0 right-0 z-10 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-56 overflow-y-auto" style={{width: '100%'}}>
                        {cityOptions.filter(opt => opt.toLowerCase().includes(cityInput.toLowerCase())).slice(0, 8).map((opt, idx) => (
                          <div
                            key={idx}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-black"
                            onMouseDown={() => {
                              setFormData({ ...formData, city: opt });
                              setCityInput(opt);
                              setShowCityDropdown(false);
                            }}
                          >
                            {opt}
                      </div>
                        ))}
                        {cityOptions.filter(opt => opt.toLowerCase().includes(cityInput.toLowerCase())).length === 0 && (
                          <div className="px-4 py-2 text-gray-400">No matches found</div>
                        )}
                  </div>
                )}
                        </div>
                </label>
                      </div>
              <div className="flex justify-between items-center mt-2">
                <button className="text-black border border-black rounded-lg px-8 py-3 bg-white hover:bg-gray-100 transition text-lg" onClick={() => setCurrentStep(2)}>Back</button>
                <button className="text-black border border-black rounded-lg px-8 py-3 bg-white hover:bg-gray-100 transition text-lg disabled:opacity-40" onClick={handleNext} disabled={!formData.city}>Next</button>
                    </div>
                  </div>
                )}
                  {currentStep === 4 && (
            <div className="flex flex-col gap-10">
              <div className="flex flex-col gap-8">
                <label className="text-black font-semibold text-lg">Education Level
                  <select
                    className="mt-3 w-full px-5 py-4 border border-black rounded-xl bg-white text-black focus:outline-none focus:ring-2 focus:ring-black transition text-lg"
                    value={formData.educationLevel}
                    onChange={e => setFormData({ ...formData, educationLevel: e.target.value })}
                    required
                  >
                    <option value="">Select your education level</option>
                    <option value="Middle School">Middle School</option>
                    <option value="High School">High School</option>
                    <option value="Undergraduate">Undergraduate</option>
                    <option value="Graduate">Graduate</option>
                    <option value="Other">Other</option>
                  </select>
                </label>
                {formData.educationLevel === "Undergraduate" && (
                  <div className="flex flex-col gap-8 mt-4">
                    <label className="text-black font-semibold text-lg">Grade
                      <select
                        className="mt-3 w-full px-5 py-4 border border-black rounded-xl bg-white text-black focus:outline-none focus:ring-2 focus:ring-black transition text-lg"
                        value={formData.educationDetail}
                        onChange={e => setFormData({ ...formData, educationDetail: e.target.value })}
                      >
                        <option value="">Select your grade</option>
                        <option value="Freshman">Freshman</option>
                        <option value="Sophomore">Sophomore</option>
                        <option value="Junior">Junior</option>
                        <option value="Senior">Senior</option>
                        <option value="Other">Other</option>
                      </select>
                    </label>
                        </div>
                )}
                {formData.educationLevel === "Graduate" && (
                  <div className="flex flex-col gap-8 mt-4">
                    <label className="text-black font-semibold text-lg">Year
                      <select
                        className="mt-3 w-full px-5 py-4 border border-black rounded-xl bg-white text-black focus:outline-none focus:ring-2 focus:ring-black transition text-lg"
                        value={formData.educationDetail}
                        onChange={e => setFormData({ ...formData, educationDetail: e.target.value })}
                      >
                        <option value="">Select your year</option>
                        <option value="2023">2023</option>
                        <option value="2022">2022</option>
                        <option value="2021">2021</option>
                        <option value="2020">2020</option>
                        <option value="2019">2019</option>
                        <option value="2018">2018</option>
                        <option value="2017">2017</option>
                        <option value="2016">2016</option>
                        <option value="2015">2015</option>
                        <option value="2014">2014</option>
                        <option value="2013">2013</option>
                        <option value="2012">2012</option>
                        <option value="2011">2011</option>
                        <option value="2010">2010</option>
                        <option value="2009">2009</option>
                        <option value="2008">2008</option>
                        <option value="2007">2007</option>
                        <option value="2006">2006</option>
                        <option value="2005">2005</option>
                        <option value="2004">2004</option>
                        <option value="2003">2003</option>
                        <option value="2002">2002</option>
                        <option value="2001">2001</option>
                        <option value="2000">2000</option>
                        <option value="1999">1999</option>
                        <option value="1998">1998</option>
                        <option value="1997">1997</option>
                        <option value="1996">1996</option>
                        <option value="1995">1995</option>
                        <option value="1994">1994</option>
                        <option value="1993">1993</option>
                        <option value="1992">1992</option>
                        <option value="1991">1991</option>
                        <option value="1990">1990</option>
                        <option value="1989">1989</option>
                        <option value="1988">1988</option>
                        <option value="1987">1987</option>
                        <option value="1986">1986</option>
                        <option value="1985">1985</option>
                        <option value="1984">1984</option>
                        <option value="1983">1983</option>
                        <option value="1982">1982</option>
                        <option value="1981">1981</option>
                        <option value="1980">1980</option>
                        <option value="1979">1979</option>
                        <option value="1978">1978</option>
                        <option value="1977">1977</option>
                        <option value="1976">1976</option>
                        <option value="1975">1975</option>
                        <option value="1974">1974</option>
                        <option value="1973">1973</option>
                        <option value="1972">1972</option>
                        <option value="1971">1971</option>
                        <option value="1970">1970</option>
                        <option value="1969">1969</option>
                        <option value="1968">1968</option>
                        <option value="1967">1967</option>
                        <option value="1966">1966</option>
                        <option value="1965">1965</option>
                        <option value="1964">1964</option>
                        <option value="1963">1963</option>
                        <option value="1962">1962</option>
                        <option value="1961">1961</option>
                        <option value="1960">1960</option>
                        <option value="1959">1959</option>
                        <option value="1958">1958</option>
                        <option value="1957">1957</option>
                        <option value="1956">1956</option>
                        <option value="1955">1955</option>
                        <option value="1954">1954</option>
                        <option value="1953">1953</option>
                        <option value="1952">1952</option>
                        <option value="1951">1951</option>
                        <option value="1950">1950</option>
                        <option value="1949">1949</option>
                        <option value="1948">1948</option>
                        <option value="1947">1947</option>
                        <option value="1946">1946</option>
                        <option value="1945">1945</option>
                        <option value="1944">1944</option>
                        <option value="1943">1943</option>
                        <option value="1942">1942</option>
                        <option value="1941">1941</option>
                        <option value="1940">1940</option>
                        <option value="1939">1939</option>
                        <option value="1938">1938</option>
                        <option value="1937">1937</option>
                        <option value="1936">1936</option>
                        <option value="1935">1935</option>
                        <option value="1934">1934</option>
                        <option value="1933">1933</option>
                        <option value="1932">1932</option>
                        <option value="1931">1931</option>
                        <option value="1930">1930</option>
                        <option value="1929">1929</option>
                        <option value="1928">1928</option>
                        <option value="1927">1927</option>
                        <option value="1926">1926</option>
                        <option value="1925">1925</option>
                        <option value="1924">1924</option>
                        <option value="1923">1923</option>
                        <option value="1922">1922</option>
                        <option value="1921">1921</option>
                        <option value="1920">1920</option>
                        <option value="1919">1919</option>
                        <option value="1918">1918</option>
                        <option value="1917">1917</option>
                        <option value="1916">1916</option>
                        <option value="1915">1915</option>
                        <option value="1914">1914</option>
                        <option value="1913">1913</option>
                        <option value="1912">1912</option>
                        <option value="1911">1911</option>
                        <option value="1910">1910</option>
                        <option value="1909">1909</option>
                        <option value="1908">1908</option>
                        <option value="1907">1907</option>
                        <option value="1906">1906</option>
                        <option value="1905">1905</option>
                        <option value="1904">1904</option>
                        <option value="1903">1903</option>
                        <option value="1902">1902</option>
                        <option value="1901">1901</option>
                        <option value="1900">1900</option>
                        <option value="1899">1899</option>
                        <option value="1898">1898</option>
                        <option value="1897">1897</option>
                        <option value="1896">1896</option>
                        <option value="1895">1895</option>
                        <option value="1894">1894</option>
                        <option value="1893">1893</option>
                        <option value="1892">1892</option>
                        <option value="1891">1891</option>
                        <option value="1890">1890</option>
                        <option value="1889">1889</option>
                        <option value="1888">1888</option>
                        <option value="1887">1887</option>
                        <option value="1886">1886</option>
                        <option value="1885">1885</option>
                        <option value="1884">1884</option>
                        <option value="1883">1883</option>
                        <option value="1882">1882</option>
                        <option value="1881">1881</option>
                        <option value="1880">1880</option>
                        <option value="1879">1879</option>
                        <option value="1878">1878</option>
                        <option value="1877">1877</option>
                        <option value="1876">1876</option>
                        <option value="1875">1875</option>
                        <option value="1874">1874</option>
                        <option value="1873">1873</option>
                        <option value="1872">1872</option>
                        <option value="1871">1871</option>
                        <option value="1870">1870</option>
                        <option value="1869">1869</option>
                        <option value="1868">1868</option>
                        <option value="1867">1867</option>
                        <option value="1866">1866</option>
                        <option value="1865">1865</option>
                        <option value="1864">1864</option>
                        <option value="1863">1863</option>
                        <option value="1862">1862</option>
                        <option value="1861">1861</option>
                        <option value="1860">1860</option>
                        <option value="1859">1859</option>
                        <option value="1858">1858</option>
                        <option value="1857">1857</option>
                        <option value="1856">1856</option>
                        <option value="1855">1855</option>
                        <option value="1854">1854</option>
                        <option value="1853">1853</option>
                        <option value="1852">1852</option>
                        <option value="1851">1851</option>
                        <option value="1850">1850</option>
                        <option value="1849">1849</option>
                        <option value="1848">1848</option>
                        <option value="1847">1847</option>
                        <option value="1846">1846</option>
                        <option value="1845">1845</option>
                        <option value="1844">1844</option>
                        <option value="1843">1843</option>
                        <option value="1842">1842</option>
                        <option value="1841">1841</option>
                        <option value="1840">1840</option>
                        <option value="1839">1839</option>
                        <option value="1838">1838</option>
                        <option value="1837">1837</option>
                        <option value="1836">1836</option>
                        <option value="1835">1835</option>
                        <option value="1834">1834</option>
                        <option value="1833">1833</option>
                        <option value="1832">1832</option>
                        <option value="1831">1831</option>
                        <option value="1830">1830</option>
                        <option value="1829">1829</option>
                        <option value="1828">1828</option>
                        <option value="1827">1827</option>
                        <option value="1826">1826</option>
                        <option value="1825">1825</option>
                        <option value="1824">1824</option>
                        <option value="1823">1823</option>
                        <option value="1822">1822</option>
                        <option value="1821">1821</option>
                        <option value="1820">1820</option>
                        <option value="1819">1819</option>
                        <option value="1818">1818</option>
                        <option value="1817">1817</option>
                        <option value="1816">1816</option>
                        <option value="1815">1815</option>
                        <option value="1814">1814</option>
                        <option value="1813">1813</option>
                        <option value="1812">1812</option>
                        <option value="1811">1811</option>
                        <option value="1810">1810</option>
                        <option value="1809">1809</option>
                        <option value="1808">1808</option>
                        <option value="1807">1807</option>
                        <option value="1806">1806</option>
                        <option value="1805">1805</option>
                        <option value="1804">1804</option>
                        <option value="1803">1803</option>
                        <option value="1802">1802</option>
                        <option value="1801">1801</option>
                        <option value="1800">1800</option>
                        <option value="1799">1799</option>
                        <option value="1798">1798</option>
                        <option value="1797">1797</option>
                        <option value="1796">1796</option>
                        <option value="1795">1795</option>
                        <option value="1794">1794</option>
                        <option value="1793">1793</option>
                        <option value="1792">1792</option>
                        <option value="1791">1791</option>
                        <option value="1790">1790</option>
                        <option value="1789">1789</option>
                        <option value="1788">1788</option>
                        <option value="1787">1787</option>
                        <option value="1786">1786</option>
                        <option value="1785">1785</option>
                        <option value="1784">1784</option>
                        <option value="1783">1783</option>
                        <option value="1782">1782</option>
                        <option value="1781">1781</option>
                        <option value="1780">1780</option>
                        <option value="1779">1779</option>
                        <option value="1778">1778</option>
                        <option value="1777">1777</option>
                        <option value="1776">1776</option>
                        <option value="1775">1775</option>
                        <option value="1774">1774</option>
                        <option value="1773">1773</option>
                        <option value="1772">1772</option>
                        <option value="1771">1771</option>
                        <option value="1770">1770</option>
                        <option value="1769">1769</option>
                        <option value="1768">1768</option>
                        <option value="1767">1767</option>
                        <option value="1766">1766</option>
                        <option value="1765">1765</option>
                        <option value="1764">1764</option>
                        <option value="1763">1763</option>
                        <option value="1762">1762</option>
                        <option value="1761">1761</option>
                        <option value="1760">1760</option>
                        <option value="1759">1759</option>
                        <option value="1758">1758</option>
                        <option value="1757">1757</option>
                        <option value="1756">1756</option>
                        <option value="1755">1755</option>
                        <option value="1754">1754</option>
                        <option value="1753">1753</option>
                        <option value="1752">1752</option>
                        <option value="1751">1751</option>
                        <option value="1750">1750</option>
                        <option value="1749">1749</option>
                        <option value="1748">1748</option>
                        <option value="1747">1747</option>
                        <option value="1746">1746</option>
                        <option value="1745">1745</option>
                        <option value="1744">1744</option>
                        <option value="1743">1743</option>
                        <option value="1742">1742</option>
                        <option value="1741">1741</option>
                        <option value="1740">1740</option>
                        <option value="1739">1739</option>
                        <option value="1738">1738</option>
                        <option value="1737">1737</option>
                        <option value="1736">1736</option>
                        <option value="1735">1735</option>
                        <option value="1734">1734</option>
                        <option value="1733">1733</option>
                        <option value="1732">1732</option>
                        <option value="1731">1731</option>
                        <option value="1730">1730</option>
                        <option value="1729">1729</option>
                        <option value="1728">1728</option>
                        <option value="1727">1727</option>
                        <option value="1726">1726</option>
                        <option value="1725">1725</option>
                        <option value="1724">1724</option>
                        <option value="1723">1723</option>
                        <option value="1722">1722</option>
                        <option value="1721">1721</option>
                        <option value="1720">1720</option>
                        <option value="1719">1719</option>
                        <option value="1718">1718</option>
                        <option value="1717">1717</option>
                        <option value="1716">1716</option>
                        <option value="1715">1715</option>
                        <option value="1714">1714</option>
                        <option value="1713">1713</option>
                        <option value="1712">1712</option>
                        <option value="1711">1711</option>
                        <option value="1710">1710</option>
                        <option value="1709">1709</option>
                        <option value="1708">1708</option>
                        <option value="1707">1707</option>
                        <option value="1706">1706</option>
                        <option value="1705">1705</option>
                        <option value="1704">1704</option>
                        <option value="1703">1703</option>
                        <option value="1702">1702</option>
                        <option value="1701">1701</option>
                        <option value="1700">1700</option>
                        <option value="1699">1699</option>
                        <option value="1698">1698</option>
                        <option value="1697">1697</option>
                        <option value="1696">1696</option>
                        <option value="1695">1695</option>
                        <option value="1694">1694</option>
                        <option value="1693">1693</option>
                        <option value="1692">1692</option>
                        <option value="1691">1691</option>
                        <option value="1690">1690</option>
                        <option value="1689">1689</option>
                        <option value="1688">1688</option>
                        <option value="1687">1687</option>
                        <option value="1686">1686</option>
                        <option value="1685">1685</option>
                        <option value="1684">1684</option>
                        <option value="1683">1683</option>
                        <option value="1682">1682</option>
                        <option value="1681">1681</option>
                        <option value="1680">1680</option>
                        <option value="1679">1679</option>
                        <option value="1678">1678</option>
                        <option value="1677">1677</option>
                        <option value="1676">1676</option>
                        <option value="1675">1675</option>
                        <option value="1674">1674</option>
                        <option value="1673">1673</option>
                        <option value="1672">1672</option>
                        <option value="1671">1671</option>
                        <option value="1670">1670</option>
                        <option value="1669">1669</option>
                        <option value="1668">1668</option>
                        <option value="1667">1667</option>
                        <option value="1666">1666</option>
                        <option value="1665">1665</option>
                        <option value="1664">1664</option>
                        <option value="1663">1663</option>
                        <option value="1662">1662</option>
                        <option value="1661">1661</option>
                        <option value="1660">1660</option>
                        <option value="1659">1659</option>
                        <option value="1658">1658</option>
                        <option value="1657">1657</option>
                        <option value="1656">1656</option>
                        <option value="1655">1655</option>
                        <option value="1654">1654</option>
                        <option value="1653">1653</option>
                        <option value="1652">1652</option>
                        <option value="1651">1651</option>
                        <option value="1650">1650</option>
                        <option value="1649">1649</option>
                        <option value="1648">1648</option>
                        <option value="1647">1647</option>
                        <option value="1646">1646</option>
                        <option value="1645">1645</option>
                        <option value="1644">1644</option>
                        <option value="1643">1643</option>
                        <option value="1642">1642</option>
                        <option value="1641">1641</option>
                        <option value="1640">1640</option>
                        <option value="1639">1639</option>
                        <option value="1638">1638</option>
                        <option value="1637">1637</option>
                        <option value="1636">1636</option>
                        <option value="1635">1635</option>
                        <option value="1634">1634</option>
                        <option value="1633">1633</option>
                        <option value="1632">1632</option>
                        <option value="1631">1631</option>
                        <option value="1630">1630</option>
                        <option value="1629">1629</option>
                        <option value="1628">1628</option>
                        <option value="1627">1627</option>
                        <option value="1626">1626</option>
                        <option value="1625">1625</option>
                        <option value="1624">1624</option>
                        <option value="1623">1623</option>
                        <option value="1622">1622</option>
                        <option value="1621">1621</option>
                        <option value="1620">1620</option>
                        <option value="1619">1619</option>
                        <option value="1618">1618</option>
                        <option value="1617">1617</option>
                        <option value="1616">1616</option>
                        <option value="1615">1615</option>
                        <option value="1614">1614</option>
                        <option value="1613">1613</option>
                        <option value="1612">1612</option>
                        <option value="1611">1611</option>
                        <option value="1610">1610</option>
                        <option value="1609">1609</option>
                        <option value="1608">1608</option>
                        <option value="1607">1607</option>
                        <option value="1606">1606</option>
                        <option value="1605">1605</option>
                        <option value="1604">1604</option>
                        <option value="1603">1603</option>
                        <option value="1602">1602</option>
                        <option value="1601">1601</option>
                        <option value="1600">1600</option>
                        <option value="1599">1599</option>
                        <option value="1598">1598</option>
                        <option value="1597">1597</option>
                        <option value="1596">1596</option>
                        <option value="1595">1595</option>
                        <option value="1594">1594</option>
                        <option value="1593">1593</option>
                        <option value="1592">1592</option>
                        <option value="1591">1591</option>
                        <option value="1590">1590</option>
                        <option value="1589">1589</option>
                        <option value="1588">1588</option>
                        <option value="1587">1587</option>
                        <option value="1586">1586</option>
                        <option value="1585">1585</option>
                        <option value="1584">1584</option>
                        <option value="1583">1583</option>
                        <option value="1582">1582</option>
                        <option value="1581">1581</option>
                        <option value="1580">1580</option>
                        <option value="1579">1579</option>
                        <option value="1578">1578</option>
                        <option value="1577">1577</option>
                        <option value="1576">1576</option>
                        <option value="1575">1575</option>
                        <option value="1574">1574</option>
                        <option value="1573">1573</option>
                        <option value="1572">1572</option>
                        <option value="1571">1571</option>
                        <option value="1570">1570</option>
                        <option value="1569">1569</option>
                        <option value="1568">1568</option>
                        <option value="1567">1567</option>
                        <option value="1566">1566</option>
                        <option value="1565">1565</option>
                        <option value="1564">1564</option>
                        <option value="1563">1563</option>
                        <option value="1562">1562</option>
                        <option value="1561">1561</option>
                        <option value="1560">1560</option>
                        <option value="1559">1559</option>
                        <option value="1558">1558</option>
                        <option value="1557">1557</option>
                        <option value="1556">1556</option>
                        <option value="1555">1555</option>
                        <option value="1554">1554</option>
                        <option value="1553">1553</option>
                        <option value="1552">1552</option>
                        <option value="1551">1551</option>
                        <option value="1550">1550</option>
                        <option value="1549">1549</option>
                        <option value="1548">1548</option>
                        <option value="1547">1547</option>
                        <option value="1546">1546</option>
                        <option value="1545">1545</option>
                        <option value="1544">1544</option>
                        <option value="1543">1543</option>
                        <option value="1542">1542</option>
                        <option value="1541">1541</option>
                        <option value="1540">1540</option>
                        <option value="1539">1539</option>
                        <option value="1538">1538</option>
                        <option value="1537">1537</option>
                        <option value="1536">1536</option>
                        <option value="1535">1535</option>
                        <option value="1534">1534</option>
                        <option value="1533">1533</option>
                        <option value="1532">1532</option>
                        <option value="1531">1531</option>
                        <option value="1530">1530</option>
                        <option value="1529">1529</option>
                        <option value="1528">1528</option>
                        <option value="1527">1527</option>
                        <option value="1526">1526</option>
                        <option value="1525">1525</option>
                        <option value="1524">1524</option>
                        <option value="1523">1523</option>
                        <option value="1522">1522</option>
                        <option value="1521">1521</option>
                        <option value="1520">1520</option>
                        <option value="1519">1519</option>
                        <option value="1518">1518</option>
                        <option value="1517">1517</option>
                        <option value="1516">1516</option>
                        <option value="1515">1515</option>
                        <option value="1514">1514</option>
                        <option value="1513">1513</option>
                        <option value="1512">1512</option>
                        <option value="1511">1511</option>
                        <option value="1510">1510</option>
                        <option value="1509">1509</option>
                        <option value="1508">1508</option>
                        <option value="1507">1507</option>
                        <option value="1506">1506</option>
                        <option value="1505">1505</option>
                        <option value="1504">1504</option>
                        <option value="1503">1503</option>
                        <option value="1502">1502</option>
                        <option value="1501">1501</option>
                        <option value="1500">1500</option>
                        <option value="1499">1499</option>
                        <option value="1498">1498</option>
                        <option value="1497">1497</option>
                        <option value="1496">1496</option>
                        <option value="1495">1495</option>
                        <option value="1494">1494</option>
                        <option value="1493">1493</option>
                        <option value="1492">1492</option>
                        <option value="1491">1491</option>
                        <option value="1490">1490</option>
                        <option value="1489">1489</option>
                        <option value="1488">1488</option>
                        <option value="1487">1487</option>
                        <option value="1486">1486</option>
                        <option value="1485">1485</option>
                        <option value="1484">1484</option>
                        <option value="1483">1483</option>
                        <option value="1482">1482</option>
                        <option value="1481">1481</option>
                        <option value="1480">1480</option>
                        <option value="1479">1479</option>
                        <option value="1478">1478</option>
                        <option value="1477">1477</option>
                        <option value="1476">1476</option>
                        <option value="1475">1475</option>
                        <option value="1474">1474</option>
                        <option value="1473">1473</option>
                        <option value="1472">1472</option>
                        <option value="1471">1471</option>
                        <option value="1470">1470</option>
                        <option value="1469">1469</option>
                        <option value="1468">1468</option>
                        <option value="1467">1467</option>
                        <option value="1466">1466</option>
                        <option value="1465">1465</option>
                        <option value="1464">1464</option>
                        <option value="1463">1463</option>
                        <option value="1462">1462</option>
                        <option value="1461">1461</option>
                        <option value="1460">1460</option>
                        <option value="1459">1459</option>
                        <option value="1458">1458</option>
                        <option value="1457">1457</option>
                        <option value="1456">1456</option>
                        <option value="1455">1455</option>
                        <option value="1454">1454</option>
                        <option value="1453">1453</option>
                        <option value="1452">1452</option>
                        <option value="1451">1451</option>
                        <option value="1450">1450</option>
                        <option value="1449">1449</option>
                        <option value="1448">1448</option>
                        <option value="1447">1447</option>
                        <option value="1446">1446</option>
                        <option value="1445">1445</option>
                        <option value="1444">1444</option>
                        <option value="1443">1443</option>
                        <option value="1442">1442</option>
                        <option value="1441">1441</option>
                        <option value="1440">1440</option>
                        <option value="1439">1439</option>
                        <option value="1438">1438</option>
                        <option value="1437">1437</option>
                        <option value="1436">1436</option>
                        <option value="1435">1435</option>
                        <option value="1434">1434</option>
                        <option value="1433">1433</option>
                        <option value="1432">1432</option>
                        <option value="1431">1431</option>
                        <option value="1430">1430</option>
                        <option value="1429">1429</option>
                        <option value="1428">1428</option>
                        <option value="1427">1427</option>
                        <option value="1426">1426</option>
                        <option value="1425">1425</option>
                        <option value="1424">1424</option>
                        <option value="1423">1423</option>
                        <option value="1422">1422</option>
                        <option value="1421">1421</option>
                        <option value="1420">1420</option>
                        <option value="1419">1419</option>
                        <option value="1418">1418</option>
                        <option value="1417">1417</option>
                        <option value="1416">1416</option>
                        <option value="1415">1415</option>
                        <option value="1414">1414</option>
                        <option value="1413">1413</option>
                        <option value="1412">1412</option>
                        <option value="1411">1411</option>
                        <option value="1410">1410</option>
                        <option value="1409">1409</option>
                        <option value="1408">1408</option>
                        <option value="1407">1407</option>
                        <option value="1406">1406</option>
                        <option value="1405">1405</option>
                        <option value="1404">1404</option>
                        <option value="1403">1403</option>
                        <option value="1402">1402</option>
                        <option value="1401">1401</option>
                        <option value="1400">1400</option>
                        <option value="1399">1399</option>
                        <option value="1398">1398</option>
                        <option value="1397">1397</option>
                        <option value="1396">1396</option>
                        <option value="1395">1395</option>
                        <option value="1394">1394</option>
                        <option value="1393">1393</option>
                        <option value="1392">1392</option>
                        <option value="1391">1391</option>
                        <option value="1390">1390</option>
                        <option value="1389">1389</option>
                        <option value="1388">1388</option>
                        <option value="1387">1387</option>
                        <option value="1386">1386</option>
                        <option value="1385">1385</option>
                        <option value="1384">1384</option>
                        <option value="1383">1383</option>
                        <option value="1382">1382</option>
                        <option value="1381">1381</option>
                        <option value="1380">1380</option>
                        <option value="1379">1379</option>
                        <option value="1378">1378</option>
                        <option value="1377">1377</option>
                        <option value="1376">1376</option>
                        <option value="1375">1375</option>
                        <option value="1374">1374</option>
                        <option value="1373">1373</option>
                        <option value="1372">1372</option>
                        <option value="1371">1371</option>
                        <option value="1370">1370</option>
                        <option value="1369">1369</option>
                        <option value="1368">1368</option>
                        <option value="1367">1367</option>
                        <option value="1366">1366</option>
                        <option value="1365">1365</option>
                        <option value="1364">1364</option>
                        <option value="1363">1363</option>
                        <option value="1362">1362</option>
                        <option value="1361">1361</option>
                        <option value="1360">1360</option>
                        <option value="1359">1359</option>
                        <option value="1358">1358</option>
                        <option value="1357">1357</option>
                        <option value="1356">1356</option>
                        <option value="1355">1355</option>
                        <option value="1354">1354</option>
                        <option value="1353">1353</option>
                        <option value="1352">1352</option>
                        <option value="1351">1351</option>
                        <option value="1350">1350</option>
                        <option value="1349">1349</option>
                        <option value="1348">1348</option>
                        <option value="1347">1347</option>
                        <option value="1346">1346</option>
                        <option value="1345">1345</option>
                        <option value="1344">1344</option>
                        <option value="1343">1343</option>
                        <option value="1342">1342</option>
                        <option value="1341">1341</option>
                        <option value="1340">1340</option>
                        <option value="1339">1339</option>
                        <option value="1338">1338</option>
                        <option value="1337">1337</option>
                        <option value="1336">1336</option>
                        <option value="1335">1335</option>
                        <option value="1334">1334</option>
                        <option value="1333">1333</option>
                        <option value="1332">1332</option>
                        <option value="1331">1331</option>
                        <option value="1330">1330</option>
                        <option value="1329">1329</option>
                        <option value="1328">1328</option>
                        <option value="1327">1327</option>
                        <option value="1326">1326</option>
                        <option value="1325">1325</option>
                        <option value="1324">1324</option>
                        <option value="1323">1323</option>
                        <option value="1322">1322</option>
                        <option value="1321">1321</option>
                        <option value="1320">1320</option>
                        <option value="1319">1319</option>
                        <option value="1318">1318</option>
                        <option value="1317">1317</option>
                        <option value="1316">1316</option>
                        <option value="1315">1315</option>
                        <option value="1314">1314</option>
                        <option value="1313">1313</option>
                        <option value="1312">1312</option>
                        <option value="1311">1311</option>
                        <option value="1310">1310</option>
                        <option value="1309">1309</option>
                        <option value="1308">1308</option>
                        <option value="1307">1307</option>
                        <option value="1306">1306</option>
                        <option value="1305">1305</option>
                        <option value="1304">1304</option>
                        <option value="1303">1303</option>
                        <option value="1302">1302</option>
                        <option value="1301">1301</option>
                        <option value="1300">1300</option>
                        <option value="1299">1299</option>
                        <option value="1298">1298</option>
                        <option value="1297">1297</option>
                        <option value="1296">1296</option>
                        <option value="1295">1295</option>
                        <option value="1294">1294</option>
                        <option value="1293">1293</option>
                        <option value="1292">1292</option>
                        <option value="1291">1291</option>
                        <option value="1290">1290</option>
                        <option value="1289">1289</option>
                        <option value="1288">1288</option>
                        <option value="1287">1287</option>
                        <option value="1286">1286</option>
                        <option value="1285">1285</option>
                        <option value="1284">1284</option>
                        <option value="1283">1283</option>
                        <option value="1282">1282</option>
                        <option value="1281">1281</option>
                        <option value="1280">1280</option>
                        <option value="1279">1279</option>
                        <option value="1278">1278</option>
                        <option value="1277">1277</option>
                        <option value="1276">1276</option>
                        <option value="1275">1275</option>
                        <option value="1274">1274</option>
                        <option value="1273">1273</option>
                        <option value="1272">1272</option>
                        <option value="1271">1271</option>
                        <option value="1270">1270</option>
                        <option value="1269">1269</option>
                        <option value="1268">1268</option>
                        <option value="1267">1267</option>
                        <option value="1266">1266</option>
                        <option value="1265">1265</option>
                        <option value="1264">1264</option>
                        <option value="1263">1263</option>
                        <option value="1262">1262</option>
                        <option value="1261">1261</option>
                        <option value="1260">1260</option>
                        <option value="1259">1259</option>
                        <option value="1258">1258</option>
                        <option value="1257">1257</option>
                        <option value="1256">1256</option>
                        <option value="1255">1255</option>
                        <option value="1254">1254</option>
                        <option value="1253">1253</option>
                        <option value="1252">1252</option>
                        <option value="1251">1251</option>
                        <option value="1250">1250</option>
                        <option value="1249">1249</option>
                        <option value="1248">1248</option>
                        <option value="1247">1247</option>
                        <option value="1246">1246</option>
                        <option value="1245">1245</option>
                        <option value="1244">1244</option>
                        <option value="1243">1243</option>
                        <option value="1242">1242</option>
                        <option value="1241">1241</option>
                        <option value="1240">1240</option>
                        <option value="1239">1239</option>
                        <option value="1238">1238</option>
                        <option value="1237">1237</option>
                        <option value="1236">1236</option>
                        <option value="1235">1235</option>
                        <option value="1234">1234</option>
                        <option value="1233">1233</option>
                        <option value="1232">1232</option>
                        <option value="1231">1231</option>
                        <option value="1230">1230</option>
                        <option value="1229">1229</option>
                        <option value="1228">1228</option>
                        <option value="1227">1227</option>
                        <option value="1226">1226</option>
                        <option value="1225">1225</option>
                        <option value="1224">1224</option>
                        <option value="1223">1223</option>
                        <option value="1222">1222</option>
                        <option value="1221">1221</option>
                        <option value="1220">1220</option>
                        <option value="1219">1219</option>
                        <option value="1218">1218</option>
                        <option value="1217">1217</option>
                        <option value="1216">1216</option>
                        <option value="1215">1215</option>
                        <option value="1214">1214</option>
                        <option value="1213">1213</option>
                        <option value="1212">1212</option>
                        <option value="1211">1211</option>
                        <option value="1210">1210</option>
                        <option value="1209">1209</option>
                        <option value="1208">1208</option>
                        <option value="1207">1207</option>
                        <option value="1206">1206</option>
                        <option value="1205">1205</option>
                        <option value="1204">1204</option>
                        <option value="1203">1203</option>
                        <option value="1202">1202</option>
                        <option value="1201">1201</option>
                        <option value="1200">1200</option>
                        <option value="1199">1199</option>
                        <option value="1198">1198</option>
                        <option value="1197">1197</option>
                        <option value="1196">1196</option>
                        <option value="1195">1195</option>
                        <option value="1194">1194</option>
                        <option value="1193">1193</option>
                        <option value="1192">1192</option>
                        <option value="1191">1191</option>
                        <option value="1190">1190</option>
                        <option value="1189">1189</option>
                        <option value="1188">1188</option>
                        <option value="1187">1187</option>
                        <option value="1186">1186</option>
                        <option value="1185">1185</option>
                        <option value="1184">1184</option>
                        <option value="1183">1183</option>
                        <option value="1182">1182</option>
                        <option value="1181">1181</option>
                        <option value="1180">1180</option>
                        <option value="1179">1179</option>
                        <option value="1178">1178</option>
                        <option value="1177">1177</option>
                        <option value="1176">1176</option>
                        <option value="1175">1175</option>
                        <option value="1174">1174</option>
                        <option value="1173">1173</option>
                        <option value="1172">1172</option>
                        <option value="1171">1171</option>
                        <option value="1170">1170</option>
                        <option value="1169">1169</option>
                        <option value="1168">1168</option>
                        <option value="1167">1167</option>
                        <option value="1166">1166</option>
                        <option value="1165">1165</option>
                        <option value="1164">1164</option>
                        <option value="1163">1163</option>
                        <option value="1162">1162</option>
                        <option value="1161">1161</option>
                        <option value="1160">1160</option>
                        <option value="1159">1159</option>
                        <option value="1158">1158</option>
                        <option value="1157">1157</option>
                        <option value="1156">1156</option>
                        <option value="1155">1155</option>
                        <option value="1154">1154</option>
                        <option value="1153">1153</option>
                        <option value="1152">1152</option>
                        <option value="1151">1151</option>
                        <option value="1150">1150</option>
                        <option value="1149">1149</option>
                        <option value="1148">1148</option>
                        <option value="1147">1147</option>
                        <option value="1146">1146</option>
                        <option value="1145">1145</option>
                        <option value="1144">1144</option>
                        <option value="1143">1143</option>
                        <option value="1142">1142</option>
                        <option value="1141">1141</option>
                        <option value="1140">1140</option>
                        <option value="1139">1139</option>
                        <option value="1138">1138</option>
                        <option value="1137">1137</option>
                        <option value="1136">1136</option>
                        <option value="1135">1135</option>
                        <option value="1134">1134</option>
                        <option value="1133">1133</option>
                        <option value="1132">1132</option>
                        <option value="1131">1131</option>
                        <option value="1130">1130</option>
                        <option value="1129">1129</option>
                        <option value="1128">1128</option>
                        <option value="1127">1127</option>
                        <option value="1126">1126</option>
                        <option value="1125">1125</option>
                        <option value="1124">1124</option>
                        <option value="1123">1123</option>
                        <option value="1122">1122</option>
                        <option value="1121">1121</option>
                        <option value="1120">1120</option>
                        <option value="1119">1119</option>
                        <option value="1118">1118</option>
                        <option value="1117">1117</option>
                        <option value="1116">1116</option>
                        <option value="1115">1115</option>
                        <option value="1114">1114</option>
                        <option value="1113">1113</option>
                        <option value="1112">1112</option>
                        <option value="1111">1111</option>
                        <option value="1110">1110</option>
                        <option value="1109">1109</option>
                        <option value="1108">1108</option>
                        <option value="1107">1107</option>
                        <option value="1106">1106</option>
                        <option value="1105">1105</option>
                        <option value="1104">1104</option>
                        <option value="1103">1103</option>
                        <option value="1102">1102</option>
                        <option value="1101">1101</option>
                        <option value="1100">1100</option>
                        <option value="1099">1099</option>
                        <option value="1098">1098</option>
                        <option value="1097">1097</option>
                        <option value="1096">1096</option>
                        <option value="1095">1095</option>
                        <option value="1094">1094</option>
                        <option value="1093">1093</option>
                        <option value="1092">1092</option>
                        <option value="1091">1091</option>
                        <option value="1090">1090</option>
                        <option value="1089">1089</option>
                        <option value="1088">1088</option>
                        <option value="1087">1087</option>
                        <option value="1086">1086</option>
                        <option value="1085">1085</option>
                        <option value="1084">1084</option>
                        <option value="1083">1083</option>
                        <option value="1082">1082</option>
                        <option value="1081">1081</option>
                        <option value="1080">1080</option>
                        <option value="1079">1079</option>
                        <option value="1078">1078</option>
                        <option value="1077">1077</option>
                        <option value="1076">1076</option>
                        <option value="1075">1075</option>
                        <option value="1074">1074</option>
                        <option value="1073">1073</option>
                        <option value="1072">1072</option>
                        <option value="1071">1071</option>
                        <option value="1070">1070</option>
                        <option value="1069">1069</option>
                        <option value="1068">1068</option>
                        <option value="1067">1067</option>
                        <option value="1066">1066</option>
                        <option value="1065">1065</option>
                        <option value="1064">1064</option>
                        <option value="1063">1063</option>
                        <option value="1062">1062</option>
                        <option value="1061">1061</option>
                        <option value="1060">1060</option>
                        <option value="1059">1059</option>
                        <option value="1058">1058</option>
                        <option value="1057">1057</option>
                        <option value="1056">1056</option>
                        <option value="1055">1055</option>
                        <option value="1054">1054</option>
                        <option value="1053">1053</option>
                        <option value="1052">1052</option>
                        <option value="1051">1051</option>
                        <option value="1050">1050</option>
                        <option value="1049">1049</option>
                        <option value="1048">1048</option>
                        <option value="1047">1047</option>
                        <option value="1046">1046</option>
                        <option value="1045">1045</option>
                        <option value="1044">1044</option>
                        <option value="1043">1043</option>
                        <option value="1042">1042</option>
                        <option value="1041">1041</option>
                        <option value="1040">1040</option>
                        <option value="1039">1039</option>
                        <option value="1038">1038</option>
                        <option value="1037">1037</option>
                        <option value="1036">1036</option>
                        <option value="1035">1035</option>
                        <option value="1034">1034</option>
                        <option value="1033">1033</option>
                        <option value="1032">1032</option>
                        <option value="1031">1031</option>
                        <option value="1030">1030</option>
                        <option value="1029">1029</option>
                        <option value="1028">1028</option>
                        <option value="1027">1027</option>
                        <option value="1026">1026</option>
                        <option value="1025">1025</option>
                        <option value="1024">1024</option>
                        <option value="1023">1023</option>
                        <option value="1022">1022</option>
                        <option value="1021">1021</option>
                        <option value="1020">1020</option>
                        <option value="1019">1019</option>
                        <option value="1018">1018</option>
                        <option value="1017">1017</option>
                        <option value="1016">1016</option>
                        <option value="1015">1015</option>
                        <option value="1014">1014</option>
                        <option value="1013">1013</option>
                        <option value="1012">1012</option>
                        <option value="1011">1011</option>
                        <option value="1010">1010</option>
                        <option value="1009">1009</option>
                        <option value="1008">1008</option>
                        <option value="1007">1007</option>
                        <option value="1006">1006</option>
                        <option value="1005">1005</option>
                        <option value="1004">1004</option>
                        <option value="1003">1003</option>
                        <option value="1002">1002</option>
                        <option value="1001">1001</option>
                        <option value="1000">1000</option>
                        <option value="999">999</option>
                        <option value="998">998</option>
                        <option value="997">997</option>
                        <option value="996">996</option>
                        <option value="995">995</option>
                        <option value="994">994</option>
                        <option value="993">993</option>
                        <option value="992">992</option>
                        <option value="991">991</option>
                        <option value="990">990</option>
                        <option value="989">989</option>
                        <option value="988">988</option>
                        <option value="987">987</option>
                        <option value="986">986</option>
                        <option value="985">985</option>
                        <option value="984">984</option>
                        <option value="983">983</option>
                        <option value="982">982</option>
                        <option value="981">981</option>
                        <option value="980">980</option>
                        <option value="979">979</option>
                        <option value="978">978</option>
                        <option value="977">977</option>
                        <option value="976">976</option>
                        <option value="975">975</option>
                        <option value="974">974</option>
                        <option value="973">973</option>
                        <option value="972">972</option>
                        <option value="971">971</option>
                        <option value="970">970</option>
                        <option value="969">969</option>
                        <option value="968">968</option>
                        <option value="967">967</option>
                        <option value="966">966</option>
                        <option value="965">965</option>
                        <option value="964">964</option>
                        <option value="963">963</option>
                        <option value="962">962</option>
                        <option value="961">961</option>
                        <option value="960">960</option>
                        <option value="959">959</option>
                        <option value="958">958</option>
                        <option value="957">957</option>
                        <option value="956">956</option>
                        <option value="955">955</option>
                        <option value="954">954</option>
                        <option value="953">953</option>
                        <option value="952">952</option>
                        <option value="951">951</option>
                        <option value="950">950</option>
                        <option value="949">949</option>
                        <option value="948">948</option>
                        <option value="947">947</option>
                        <option value="946">946</option>
                        <option value="945">945</option>
                        <option value="944">944</option>
                        <option value="943">943</option>
                        <option value="942">942</option>
                        <option value="941">941</option>
                        <option value="940">940</option>
                        <option value="939">939</option>
                        <option value="938">938</option>
                        <option value="937">937</option>
                        <option value="936">936</option>
                        <option value="935">935</option>
                        <option value="934">934</option>
                        <option value="933">933</option>
                        <option value="932">932</option>
                        <option value="931">931</option>
                        <option value="930">930</option>
                        <option value="929">929</option>
                        <option value="928">928</option>
                        <option value="927">927</option>
                        <option value="926">926</option>
                        <option value="925">925</option>
                        <option value="924">924</option>
                        <option value="923">923</option>
                        <option value="922">922</option>
                        <option value="921">921</option>
                        <option value="920">920</option>
                        <option value="919">919</option>
                        <option value="918">918</option>
                        <option value="917">917</option>
                        <option value="916">916</option>
                        <option value="915">915</option>
                        <option value="914">914</option>
                        <option value="913">913</option>
                        <option value="912">912</option>
                        <option value="911">911</option>
                        <option value="910">910</option>
                        <option value="909">909</option>
                        <option value="908">908</option>
                        <option value="907">907</option>
                        <option value="906">906</option>
                        <option value="905">905</option>
                        <option value="904">904</option>
                        <option value="903">903</option>
                        <option value="902">902</option>
                        <option value="901">901</option>
                        <option value="900">900</option>
                        <option value="899">899</option>
                        <option value="898">898</option>
                        <option value="897">897</option>
                        <option value="896">896</option>
                        <option value="895">895</option>
                        <option value="894">894</option>
                        <option value="893">893</option>
                        <option value="892">892</option>
                        <option value="891">891</option>
                        <option value="890">890</option>
                        <option value="889">889</option>
                        <option value="888">888</option>
                        <option value="887">887</option>
                        <option value="886">886</option>
                        <option value="885">885</option>
                        <option value="884">884</option>
                        <option value="883">883</option>
                        <option value="882">882</option>
                        <option value="881">881</option>
                        <option value="880">880</option>
                        <option value="879">879</option>
                        <option value="878">878</option>
                        <option value="877">877</option>
                        <option value="876">876</option>
                        <option value="875">875</option>
                        <option value="874">874</option>
                        <option value="873">873</option>
                        <option value="872">872</option>
                        <option value="871">871</option>
                        <option value="870">870</option>
                        <option value="869">869</option>
                        <option value="868">868</option>
                        <option value="867">867</option>
                        <option value="866">866</option>
                        <option value="865">865</option>
                        <option value="864">864</option>
                        <option value="863">863</option>
                        <option value="862">862</option>
                        <option value="861">861</option>
                        <option value="860">860</option>
                        <option value="859">859</option>
                        <option value="858">858</option>
                        <option value="857">857</option>
                        <option value="856">856</option>
                        <option value="855">855</option>
                        <option value="854">854</option>
                        <option value="853">853</option>
                        <option value="852">852</option>
                        <option value="851">851</option>
                        <option value="850">850</option>
                        <option value="849">849</option>
                        <option value="848">848</option>
                        <option value="847">847</option>
                        <option value="846">846</option>
                        <option value="845">845</option>
                        <option value="844">844</option>
                        <option value="843">843</option>
                        <option value="842">842</option>
                        <option value="841">841</option>
                        <option value="840">840</option>
                        <option value="839">839</option>
                        <option value="838">838</option>
                        <option value="837">837</option>
                        <option value="836">836</option>
                        <option value="835">835</option>
                        <option value="834">834</option>
                        <option value="833">833</option>
                        <option value="832">832</option>
                        <option value="831">831</option>
                        <option value="830">830</option>
                        <option value="829">829</option>
                        <option value="828">828</option>
                        <option value="827">827</option>
                        <option value="826">826</option>
                        <option value="825">825</option>
                        <option value="824">824</option>
                        <option value="823">823</option>
                        <option value="822">822</option>
                        <option value="821">821</option>
                        <option value="820">820</option>
                        <option value="819">819</option>
                        <option value="818">818</option>
                        <option value="817">817</option>
                        <option value="816">816</option>
                        <option value="815">815</option>
                        <option value="814">814</option>
                        <option value="813">813</option>
                        <option value="812">812</option>
                        <option value="811">811</option>
                        <option value="810">810</option>
                        <option value="809">809</option>
                        <option value="808">808</option>
                        <option value="807">807</option>
                        <option value="806">806</option>
                        <option value="805">805</option>
                        <option value="804">804</option>
                        <option value="803">803</option>
                        <option value="802">802</option>
                        <option value="801">801</option>
                        <option value="800">800</option>
                        <option value="799">799</option>
                        <option value="798">798</option>
                        <option value="797">797</option>
                        <option value="796">796</option>
                        <option value="795">795</option>
                        <option value="794">794</option>
                        <option value="793">793</option>
                        <option value="792">792</option>
                        <option value="791">791</option>
                        <option value="790">790</option>
                        <option value="789">789</option>
                        <option value="788">788</option>
                        <option value="787">787</option>
                        <option value="786">786</option>
                        <option value="785">785</option>
                        <option value="784">784</option>
                        <option value="783">783</option>
                        <option value="782">782</option>
                        <option value="781">781</option>
                        <option value="780">780</option>
                        <option value="779">779</option>
                        <option value="778">778</option>
                        <option value="777">777</option>
                        <option value="776">776</option>
                        <option value="775">775</option>
                        <option value="774">774</option>
                        <option value="773">773</option>
                        <option value="772">772</option>
                        <option value="771">771</option>
                        <option value="770">770</option>
                        <option value="769">769</option>
                        <option value="768">768</option>
                        <option value="767">767</option>
                        <option value="766">766</option>
                        <option value="765">765</option>
                        <option value="764">764</option>
                        <option value="763">763</option>
                        <option value="762">762</option>
                        <option value="761">761</option>
                        <option value="760">760</option>
                        <option value="759">759</option>
                        <option value="758">758</option>
                        <option value="757">757</option>
                        <option value="756">756</option>
                        <option value="755">755</option>
                        <option value="754">754</option>
                        <option value="753">753</option>
                        <option value="752">752</option>
                        <option value="751">751</option>
                        <option value="750">750</option>
                        <option value="749">749</option>
                        <option value="748">748</option>
                        <option value="747">747</option>
                        <option value="746">746</option>
                        <option value="745">745</option>
                        <option value="744">744</option>
                        <option value="743">743</option>
                        <option value="742">742</option>
                        <option value="741">741</option>
                        <option value="740">740</option>
                        <option value="739">739</option>
                        <option value="738">738</option>
                        <option value="737">737</option>
                        <option value="736">736</option>
                        <option value="735">735</option>
                        <option value="734">734</option>
                        <option value="733">733</option>
                        <option value="732">732</option>
                        <option value="731">731</option>
                        <option value="730">730</option>
                        <option value="729">729</option>
                        <option value="728">728</option>
                        <option value="727">727</option>
                        <option value="726">726</option>
                        <option value="725">725</option>
                        <option value="724">724</option>
                        <option value="723">723</option>
                        <option value="722">722</option>
                        <option value="721">721</option>
                        <option value="720">720</option>
                        <option value="719">719</option>
                        <option value="718">718</option>
                        <option value="717">717</option>
                        <option value="716">716</option>
                        <option value="715">715</option>
                        <option value="714">714</option>
                        <option value="713">713</option>
                        <option value="712">712</option>
                        <option value="711">711</option>
                        <option value="710">710</option>
                        <option value="709">709</option>
                        <option value="708">708</option>
                        <option value="707">707</option>
                        <option value="706">706</option>
                        <option value="705">705</option>
                        <option value="704">704</option>
                        <option value="703">703</option>
                        <option value="702">702</option>
                        <option value="701">701</option>
                        <option value="700">700</option>
                        <option value="699">699</option>
                        <option value="698">698</option>
                        <option value="697">697</option>
                        <option value="696">696</option>
                        <option value="695">695</option>
                        <option value="694">694</option>
                        <option value="693">693</option>
                        <option value="692">692</option>
                        <option value="691">691</option>
                        <option value="690">690</option>
                        <option value="689">689</option>
                        <option value="688">688</option>
                        <option value="687">687</option>
                        <option value="686">686</option>
                        <option value="685">685</option>
                        <option value="684">684</option>
                        <option value="683">683</option>
                        <option value="682">682</option>
                        <option value="681">681</option>
                        <option value="680">680</option>
                        <option value="679">679</option>
                        <option value="678">678</option>
                        <option value="677">677</option>
                        <option value="676">676</option>
                        <option value="675">675</option>
                        <option value="674">674</option>
                        <option value="673">673</option>
                        <option value="672">672</option>
                        <option value="671">671</option>
                        <option value="670">670</option>
                        <option value="669">669</option>
                        <option value="668">668</option>
                        <option value="667">667</option>
                        <option value="666">666</option>
                        <option value="665">665</option>
                        <option value="664">664</option>
                        <option value="663">663</option>
                        <option value="662">662</option>
                        <option value="661">661</option>
                        <option value="660">660</option>
                        <option value="659">659</option>
                        <option value="658">658</option>
                        <option value="657">657</option>
                        <option value="656">656</option>
                        <option value="655">655</option>
                        <option value="654">654</option>
                        <option value="653">653</option>
                        <option value="652">652</option>
                        <option value="651">651</option>
                        <option value="650">650</option>
                        <option value="649">649</option>
                        <option value="648">648</option>
                        <option value="647">647</option>
                        <option value="646">646</option>
                        <option value="645">645</option>
                        <option value="644">644</option>
                        <option value="643">643</option>
                        <option value="642">642</option>
                        <option value="641">641</option>
                        <option value="640">640</option>
                        <option value="639">639</option>
                        <option value="638">638</option>
                        <option value="637">637</option>
                        <option value="636">636</option>
                        <option value="635">635</option>
                        <option value="634">634</option>
                        <option value="633">633</option>
                        <option value="632">632</option>
                        <option value="631">631</option>
                        <option value="630">630</option>
                        <option value="629">629</option>
                        <option value="628">628</option>
                        <option value="627">627</option>
                        <option value="626">626</option>
                        <option value="625">625</option>
                        <option value="624">624</option>
                        <option value="623">623</option>
                        <option value="622">622</option>
                        <option value="621">621</option>
                        <option value="620">620</option>
                        <option value="619">619</option>
                        <option value="618">618</option>
                        <option value="617">617</option>
                        <option value="616">616</option>
                        <option value="615">615</option>
                        <option value="614">614</option>
                        <option value="613">613</option>
                        <option value="612">612</option>
                        <option value="611">611</option>
                        <option value="610">610</option>
                        <option value="609">609</option>
                        <option value="608">608</option>
                        <option value="607">607</option>
                        <option value="606">606</option>
                        <option value="605">605</option>
                        <option value="604">604</option>
                        <option value="603">603</option>
                        <option value="602">602</option>
                        <option value="601">601</option>
                        <option value="600">600</option>
                        <option value="599">599</option>
                        <option value="598">598</option>
                        <option value="597">597</option>
                        <option value="596">596</option>
                        <option value="595">595</option>
                        <option value="594">594</option>
                        <option value="593">593</option>
                        <option value="592">592</option>
                        <option value="591">591</option>
                        <option value="590">590</option>
                        <option value="589">589</option>
                        <option value="588">588</option>
                        <option value="587">587</option>
                        <option value="586">586</option>
                        <option value="585">585</option>
                        <option value="584">584</option>
                        <option value="583">583</option>
                        <option value="582">582</option>
                        <option value="581">581</option>
                        <option value="580">580</option>
                        <option value="579">579</option>
                        <option value="578">578</option>
                        <option value="577">577</option>
                        <option value="576">576</option>
                        <option value="575">575</option>
                        <option value="574">574</option>
                        <option value="573">573</option>
                        <option value="572">572</option>
                        <option value="571">571</option>
                        <option value="570">570</option>
                        <option value="569">569</option>
                        <option value="568">568</option>
                        <option value="567">567</option>
                        <option value="566">566</option>
                        <option value="565">565</option>
                        <option value="564">564</option>
                        <option value="563">563</option>
                        <option value="562">562</option>
                        <option value="561">561</option>
                        <option value="560">560</option>
                        <option value="559">559</option>
                        <option value="558">558</option>
                        <option value="557">557</option>
                        <option value="556">556</option>
                        <option value="555">555</option>
                        <option value="554">554</option>
                        <option value="553">553</option>
                        <option value="552">552</option>
                        <option value="551">551</option>
                        <option value="550">550</option>
                        <option value="549">549</option>
                        <option value="548">548</option>
                        <option value="547">547</option>
                        <option value="546">546</option>
                        <option value="545">545</option>
                        <option value="544">544</option>
                        <option value="543">543</option>
                        <option value="542">542</option>
                        <option value="541">541</option>
                        <option value="540">540</option>
                        <option value="539">539</option>
                        <option value="538">538</option>
                        <option value="537">537</option>
                        <option value="536">536</option>
                        <option value="535">535</option>
                        <option value="534">534</option>
                        <option value="533">533</option>
                        <option value="532">532</option>
                        <option value="531">531</option>
                        <option value="530">530</option>
                        <option value="529">529</option>
                        <option value="528">528</option>
                        <option value="527">527</option>
                        <option value="526">526</option>
                        <option value="525">525</option>
                        <option value="524">524</option>
                        <option value="523">523</option>
                        <option value="522">522</option>
                        <option value="521">521</option>
                        <option value="520">520</option>
                        <option value="519">519</option>
                        <option value="518">518</option>
                        <option value="517">517</option>
                        <option value="516">516</option>
                        <option value="515">515</option>
                        <option value="514">514</option>
                        <option value="513">513</option>
                        <option value="512">512</option>
                        <option value="511">511</option>
                        <option value="510">510</option>
                        <option value="509">509</option>
                        <option value="508">508</option>
                        <option value="507">507</option>
                        <option value="506">506</option>
                        <option value="505">505</option>
                        <option value="504">504</option>
                        <option value="503">503</option>
                        <option value="502">502</option>
                        <option value="501">501</option>
                        <option value="500">500</option>
                        <option value="499">499</option>
                        <option value="498">498</option>
                        <option value="497">497</option>
                        <option value="496">496</option>
                        <option value="495">495</option>
                        <option value="494">494</option>
                        <option value="493">493</option>
                        <option value="492">492</option>
                        <option value="491">491</option>
                        <option value="490">490</option>
                        <option value="489">489</option>
                        <option value="488">488</option>
                        <option value="487">487</option>
                        <option value="486">486</option>
                        <option value="485">485</option>
                        <option value="484">484</option>
                        <option value="483">483</option>
                        <option value="482">482</option>
                        <option value="481">481</option>
                        <option value="480">480</option>
                        <option value="479">479</option>
                        <option value="478">478</option>
                        <option value="477">477</option>
                        <option value="476">476</option>
                        <option value="475">475</option>
                        <option value="474">474</option>
                        <option value="473">473</option>
                        <option value="472">472</option>
                        <option value="471">471</option>
                        <option value="470">470</option>
                        <option value="469">469</option>
                        <option value="468">468</option>
                        <option value="467">467</option>
                        <option value="466">466</option>
                        <option value="465">465</option>
                        <option value="464">464</option>
                        <option value="463">463</option>
                        <option value="462">462</option>
                        <option value="461">461</option>
                        <option value="460">460</option>
                        <option value="459">459</option>
                        <option value="458">458</option>
                        <option value="457">457</option>
                        <option value="456">456</option>
                        <option value="455">455</option>
                        <option value="454">454</option>
                        <option value="453">453</option>
                        <option value="452">452</option>
                        <option value="451">451</option>
                        <option value="450">450</option>
                        <option value="449">449</option>
                        <option value="448">448</option>
                        <option value="447">447</option>
                        <option value="446">446</option>
                        <option value="445">445</option>
                        <option value="444">444</option>
                        <option value="443">443</option>
                        <option value="442">442</option>
                        <option value="441">441</option>
                        <option value="440">440</option>
                        <option value="439">439</option>
                        <option value="438">438</option>
                        <option value="437">437</option>
                        <option value="436">436</option>
                        <option value="435">435</option>
                        <option value="434">434</option>
                        <option value="433">433</option>
                        <option value="432">432</option>
                        <option value="431">431</option>
                        <option value="430">430</option>
                        <option value="429">429</option>
                        <option value="428">428</option>
                        <option value="427">427</option>
                        <option value="426">426</option>
                        <option value="425">425</option>
                        <option value="424">424</option>
                        <option value="423">423</option>
                        <option value="422">422</option>
                        <option value="421">421</option>
                        <option value="420">420</option>
                        <option value="419">419</option>
                        <option value="418">418</option>
                        <option value="417">417</option>
                        <option value="416">416</option>
                        <option value="415">415</option>
                        <option value="414">414</option>
                        <option value="413">413</option>
                        <option value="412">412</option>
                        <option value="411">411</option>
                        <option value="410">410</option>
                        <option value="409">409</option>
                        <option value="408">408</option>
                        <option value="407">407</option>
                        <option value="406">406</option>
                        <option value="405">405</option>
                        <option value="404">404</option>
                        <option value="403">403</option>
                        <option value="402">402</option>
                        <option value="401">401</option>
                        <option value="400">400</option>
                        <option value="399">399</option>
                        <option value="398">398</option>
                        <option value="397">397</option>
                        <option value="396">396</option>
                        <option value="395">395</option>
                        <option value="394">394</option>
                        <option value="393">393</option>
                        <option value="392">392</option>
                        <option value="391">391</option>
                        <option value="390">390</option>
                        <option value="389">389</option>
                        <option value="388">388</option>
                        <option value="387">387</option>
                        <option value="386">386</option>
                        <option value="385">385</option>
                        <option value="384">384</option>
                        <option value="383">383</option>
                        <option value="382">382</option>
                        <option value="381">381</option>
                        <option value="380">380</option>
                        <option value="379">379</option>
                        <option value="378">378</option>
                        <option value="377">377</option>
                        <option value="376">376</option>
                        <option value="375">375</option>
                        <option value="374">374</option>
                        <option value="373">373</option>
                        <option value="372">372</option>
                        <option value="371">371</option>
                        <option value="370">370</option>
                        <option value="369">369</option>
                        <option value="368">368</option>
                        <option value="367">367</option>
                        <option value="366">366</option>
                        <option value="365">365</option>
                        <option value="364">364</option>
                        <option value="363">363</option>
                        <option value="362">362</option>
                        <option value="361">361</option>
                        <option value="360">360</option>
                        <option value="359">359</option>
                        <option value="358">358</option>
                        <option value="357">357</option>
                        <option value="356">356</option>
                        <option value="355">355</option>
                        <option value="354">354</option>
                        <option value="353">353</option>
                        <option value="352">352</option>
                        <option value="351">351</option>
                        <option value="350">350</option>
                        <option value="349">349</option>
                        <option value="348">348</option>
                        <option value="347">347</option>
                        <option value="346">346</option>
                        <option value="345">345</option>
                        <option value="344">344</option>
                        <option value="343">343</option>
                        <option value="342">342</option>
                        <option value="341">341</option>
                        <option value="340">340</option>
                        <option value="339">339</option>
                        <option value="338">338</option>
                        <option value="337">337</option>
                        <option value="336">336</option>
                        <option value="335">335</option>
                        <option value="334">334</option>
                        <option value="333">333</option>
                        <option value="332">332</option>
                        <option value="331">331</option>
                        <option value="330">330</option>
                        <option value="329">329</option>
                        <option value="328">328</option>
                        <option value="327">327</option>
                        <option value="326">326</option>
                        <option value="325">325</option>
                        <option value="324">324</option>
                        <option value="323">323</option>
                        <option value="322">322</option>
                        <option value="321">321</option>
                        <option value="320">320</option>
                        <option value="319">319</option>
                        <option value="318">318</option>
                        <option value="317">317</option>
                        <option value="316">316</option>
                        <option value="315">315</option>
                        <option value="314">314</option>
                        <option value="313">313</option>
                        <option value="312">312</option>
                        <option value="311">311</option>
                        <option value="310">310</option>
                        <option value="309">309</option>
                        <option value="308">308</option>
                        <option value="307">307</option>
                        <option value="306">306</option>
                        <option value="305">305</option>
                        <option value="304">304</option>
                        <option value="303">303</option>
                        <option value="302">302</option>
                        <option value="301">301</option>
                        <option value="300">300</option>
                        <option value="299">299</option>
                        <option value="298">298</option>
                        <option value="297">297</option>
                        <option value="296">296</option>
                        <option value="295">295</option>
                        <option value="294">294</option>
                        <option value="293">293</option>
                        <option value="292">292</option>
                        <option value="291">291</option>
                        <option value="290">290</option>
                        <option value="289">289</option>
                        <option value="288">288</option>
                        <option value="287">287</option>
                        <option value="286">286</option>
                        <option value="285">285</option>
                        <option value="284">284</option>
                        <option value="283">283</option>
                        <option value="282">282</option>
                        <option value="281">281</option>
                        <option value="280">280</option>
                        <option value="279">279</option>
                        <option value="278">278</option>
                        <option value="277">277</option>
                        <option value="276">276</option>
                        <option value="275">275</option>
                        <option value="274">274</option>
                        <option value="273">273</option>
                        <option value="272">272</option>
                        <option value="271">271</option>
                        <option value="270">270</option>
                        <option value="269">269</option>
                        <option value="268">268</option>
                        <option value="267">267</option>
                        <option value="266">266</option>
                        <option value="265">265</option>
                        <option value="264">264</option>
                        <option value="263">263</option>
                        <option value="262">262</option>
                        <option value="261">261</option>
                        <option value="260">260</option>
                        <option value="259">259</option>
                        <option value="258">258</option>
                        <option value="257">257</option>
                        <option value="256">256</option>
                        <option value="255">255</option>
                        <option value="254">254</option>
                        <option value="253">253</option>
                        <option value="252">252</option>
                        <option value="251">251</option>
                        <option value="250">250</option>
                        <option value="249">249</option>
                        <option value="248">248</option>
                        <option value="247">247</option>
                        <option value="246">246</option>
                        <option value="245">245</option>
                        <option value="244">244</option>
                        <option value="243">243</option>
                        <option value="242">242</option>
                        <option value="241">241</option>
                        <option value="240">240</option>
                        <option value="239">239</option>
                        <option value="238">238</option>
                        <option value="237">237</option>
                        <option value="236">236</option>
                        <option value="235">235</option>
                        <option value="234">234</option>
                        <option value="233">233</option>
                        <option value="232">232</option>
                        <option value="231">231</option>
                        <option value="230">230</option>
                        <option value="229">229</option>
                        <option value="228">228</option>
                        <option value="227">227</option>
                        <option value="226">226</option>
                        <option value="225">225</option>
                        <option value="224">224</option>
                        <option value="223">223</option>
                        <option value="222">222</option>
                        <option value="221">221</option>
                        <option value="220">220</option>
                        <option value="219">219</option>
                        <option value="218">218</option>
                        <option value="217">217</option>
                        <option value="216">216</option>
                        <option value="215">215</option>
                        <option value="214">214</option>
                        <option value="213">213</option>
                        <option value="212">212</option>
                        <option value="211">211</option>
                        <option value="210">210</option>
                        <option value="209">209</option>
                        <option value="208">208</option>
                        <option value="207">207</option>
                        <option value="206">206</option>
                        <option value="205">205</option>
                        <option value="204">204</option>
                        <option value="203">203</option>
                        <option value="202">202</option>
                        <option value="201">201</option>
                        <option value="200">200</option>
                        <option value="199">199</option>
                        <option value="198">198</option>
                        <option value="197">197</option>
                        <option value="196">196</option>
                        <option value="195">195</option>
                        <option value="194">194</option>
                        <option value="193">193</option>
                        <option value="192">192</option>
                        <option value="191">191</option>
                        <option value="190">190</option>
                        <option value="189">189</option>
                        <option value="188">188</option>
                        <option value="187">187</option>
                        <option value="186">186</option>
                        <option value="185">185</option>
                        <option value="184">184</option>
                        <option value="183">183</option>
                        <option value="182">182</option>
                        <option value="181">181</option>
                        <option value="180">180</option>
                        <option value="179">179</option>
                        <option value="178">178</option>
                        <option value="177">177</option>
                        <option value="176">176</option>
                        <option value="175">175</option>
                        <option value="174">174</option>
                        <option value="173">173</option>
                        <option value="172">172</option>
                        <option value="171">171</option>
                        <option value="170">170</option>
                        <option value="169">169</option>
                        <option value="168">168</option>
                        <option value="167">167</option>
                        <option value="166">166</option>
                        <option value="165">165</option>
                        <option value="164">164</option>
                        <option value="163">163</option>
                        <option value="162">162</option>
                        <option value="161">161</option>
                        <option value="160">160</option>
                        <option value="159">159</option>
                        <option value="158">158</option>
                        <option value="157">157</option>
                        <option value="156">156</option>
                        <option value="155">155</option>
                        <option value="154">154</option>
                        <option value="153">153</option>
                        <option value="152">152</option>
                        <option value="151">151</option>
                        <option value="150">150</option>
                        <option value="149">149</option>
                        <option value="148">148</option>
                        <option value="147">147</option>
                        <option value="146">146</option>
                        <option value="145">145</option>
                        <option value="144">144</option>
                        <option value="143">143</option>
                        <option value="142">142</option>
                        <option value="141">141</option>
                        <option value="140">140</option>
                        <option value="139">139</option>
                        <option value="138">138</option>
                        <option value="137">137</option>
                        <option value="136">136</option>
                        <option value="135">135</option>
                        <option value="134">134</option>
                        <option value="133">133</option>
                        <option value="132">132</option>
                        <option value="131">131</option>
                        <option value="130">130</option>
                        <option value="129">129</option>
                        <option value="128">128</option>
                        <option value="127">127</option>
                        <option value="126">126</option>
                        <option value="125">125</option>
                        <option value="124">124</option>
                        <option value="123">123</option>
                        <option value="122">122</option>
                        <option value="121">121</option>
                        <option value="120">120</option>
                        <option value="119">119</option>
                        <option value="118">118</option>
                        <option value="117">117</option>
                        <option value="116">116</option>
                        <option value="115">115</option>
                        <option value="114">114</option>
                        <option value="113">113</option>
                        <option value="112">112</option>
                        <option value="111">111</option>
                        <option value="110">110</option>
                        <option value="109">109</option>
                        <option value="108">108</option>
                        <option value="107">107</option>
                        <option value="106">106</option>
                        <option value="105">105</option>
                        <option value="104">104</option>
                        <option value="103">103</option>
                        <option value="102">102</option>
                        <option value="101">101</option>
                        <option value="100">100</option>
                        <option value="99">99</option>
                        <option value="98">98</option>
                        <option value="97">97</option>
                        <option value="96">96</option>
                        <option value="95">95</option>
                        <option value="94">94</option>
                        <option value="93">93</option>
                        <option value="92">92</option>
                        <option value="91">91</option>
                        <option value="90">90</option>
                        <option value="89">89</option>
                        <option value="88">88</option>
                        <option value="87">87</option>
                        <option value="86">86</option>
                        <option value="85">85</option>
                        <option value="84">84</option>
                        <option value="83">83</option>
                        <option value="82">82</option>
                        <option value="81">81</option>
                        <option value="80">80</option>
                        <option value="79">79</option>
                        <option value="78">78</option>
                        <option value="77">77</option>
                        <option value="76">76</option>
                        <option value="75">75</option>
                        <option value="74">74</option>
                        <option value="73">73</option>
                        <option value="72">72</option>
                        <option value="71">71</option>
                        <option value="70">70</option>
                        <option value="69">69</option>
                        <option value="68">68</option>
                        <option value="67">67</option>
                        <option value="66">66</option>
                        <option value="65">65</option>
                        <option value="64">64</option>
                        <option value="63">63</option>
                        <option value="62">62</option>
                        <option value="61">61</option>
                        <option value="60">60</option>
                        <option value="59">59</option>
                        <option value="58">58</option>
                        <option value="57">57</option>
                        <option value="56">56</option>
                        <option value="55">55</option>
                        <option value="54">54</option>
                        <option value="53">53</option>
                        <option value="52">52</option>
                        <option value="51">51</option>
                        <option value="50">50</option>
                        <option value="49">49</option>
                        <option value="48">48</option>
                        <option value="47">47</option>
                        <option value="46">46</option>
                        <option value="45">45</option>
                        <option value="44">44</option>
                        <option value="43">43</option>
                        <option value="42">42</option>
                        <option value="41">41</option>
                        <option value="40">40</option>
                        <option value="39">39</option>
                        <option value="38">38</option>
                        <option value="37">37</option>
                        <option value="36">36</option>
                        <option value="35">35</option>
                        <option value="34">34</option>
                        <option value="33">33</option>
                        <option value="32">32</option>
                        <option value="31">31</option>
                        <option value="30">30</option>
                        <option value="29">29</option>
                        <option value="28">28</option>
                        <option value="27">27</option>
                        <option value="26">26</option>
                        <option value="25">25</option>
                        <option value="24">24</option>
                        <option value="23">23</option>
                        <option value="22">22</option>
                        <option value="21">21</option>
                        <option value="20">20</option>
                        <option value="19">19</option>
                        <option value="18">18</option>
                        <option value="17">17</option>
                        <option value="16">16</option>
                        <option value="15">15</option>
                        <option value="14">14</option>
                        <option value="13">13</option>
                        <option value="12">12</option>
                        <option value="11">11</option>
                        <option value="10">10</option>
                        <option value="9">9</option>
                        <option value="8">8</option>
                        <option value="7">7</option>
                        <option value="6">6</option>
                        <option value="5">5</option>
                        <option value="4">4</option>
                        <option value="3">3</option>
                        <option value="2">2</option>
                        <option value="1">1</option>
                        <option value="0">0</option>
                      </select>
                    </label>
                      </div>
                )}
                    </div>
              <div className="flex justify-between items-center mt-2">
                <button className="text-black border border-black rounded-lg px-8 py-3 bg-white hover:bg-gray-100 transition text-lg" onClick={() => setCurrentStep(3)}>Back</button>
                <button className="text-black border border-black rounded-lg px-8 py-3 bg-white hover:bg-gray-100 transition text-lg disabled:opacity-40" onClick={handleNext} disabled={!formData.educationLevel}>Next</button>
                  </div>
                  </div>
                )}
          {currentStep === 5 && (
            <div className="flex flex-col gap-10">
              <div className="flex flex-col gap-8">
                <label className="text-black font-semibold text-lg">Interests
                  <input
                    type="text"
                    className="mt-3 w-full px-5 py-4 border border-black rounded-xl bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black transition text-lg"
                    placeholder="Type an interest and press Enter"
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const value = e.currentTarget.value.trim();
                        if (value && !formData.interests.includes(value)) {
                          setFormData({ ...formData, interests: [...formData.interests, value] });
                          e.currentTarget.value = '';
                        }
                      }
                    }}
                  />
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.interests.map((interest, idx) => (
                      <span key={idx} className="px-3 py-1 bg-gray-200 text-black rounded-full text-sm flex items-center gap-1">
                        {interest}
                        <button type="button" className="ml-1 text-gray-500 hover:text-black" onClick={() => setFormData({ ...formData, interests: formData.interests.filter((_, i) => i !== idx) })}>&times;</button>
                      </span>
                    ))}
                  </div>
                </label>
                </div>
              <div className="flex justify-between items-center mt-2">
                <button className="text-black border border-black rounded-lg px-8 py-3 bg-white hover:bg-gray-100 transition text-lg" onClick={() => setCurrentStep(4)}>Back</button>
                <button className="text-black border border-black rounded-lg px-8 py-3 bg-white hover:bg-gray-100 transition text-lg disabled:opacity-40" onClick={handleNext} disabled={formData.interests.length === 0}>Finish</button>
                </div>
      </div>
      )}
                </div>
      </div>
    </div>
  );
} 