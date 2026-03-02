"use client";

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <p className="text-default-500 mb-8 font-medium">Last updated: May 20, 2024</p>
      
      <div className="flex flex-col gap-8">
        <section>
          <h2 className="text-xl font-bold mb-3">1. Information Collection</h2>
          <p className="text-default-600 leading-relaxed">
            We collect information from you when you visit our site, register on our site, or use our services. 
            The information collected may include your name, email address, and other details.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">2. Information Use</h2>
          <p className="text-default-600 leading-relaxed">
            Any of the information we collect from you may be used to personalize your experience, 
            improve our website, and improve customer service.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">3. Information Protection</h2>
          <p className="text-default-600 leading-relaxed">
            We implement a variety of security measures to maintain the safety of your personal information 
            when you enter, submit, or access your personal information.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">4. Cookies</h2>
          <p className="text-default-600 leading-relaxed">
            We use cookies to understand and save your preferences for future visits and compile aggregate data about site traffic 
            and site interaction so that we can offer better site experiences and tools in the future.
          </p>
        </section>
      </div>
    </div>
  );
}
