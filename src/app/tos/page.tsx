"use client";

import { Divider } from "@heroui/react";

export default function TosPage() {
  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
      <p className="text-default-500 mb-8 font-medium">Last updated: May 20, 2024</p>
      
      <div className="flex flex-col gap-8">
        <section>
          <h2 className="text-xl font-bold mb-3">1. Acceptance of Terms</h2>
          <p className="text-default-600 leading-relaxed">
            By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement. 
            In addition, when using this website&apos;s particular services, you shall be subject to any posted guidelines or rules applicable to such services.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">2. Use License</h2>
          <p className="text-default-600 leading-relaxed">
            Permission is granted to temporarily download one copy of the materials (information or software) on our website for personal, 
            non-commercial transitory viewing only.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">3. Disclaimer</h2>
          <p className="text-default-600 leading-relaxed">
            The materials on our website are provided on an &apos;as is&apos; basis. We make no warranties, expressed or implied, 
            and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, 
            fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">4. Limitations</h2>
          <p className="text-default-600 leading-relaxed">
            In no event shall we or our suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, 
            or due to business interruption) arising out of the use or inability to use the materials on our website.
          </p>
        </section>
      </div>
    </div>
  );
}
