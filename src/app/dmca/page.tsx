"use client";

export default function DmcaPage() {
  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">DMCA Policy</h1>
      <p className="text-default-500 mb-8 font-medium">Last updated: May 20, 2024</p>
      
      <div className="flex flex-col gap-8">
        <section>
          <h2 className="text-xl font-bold mb-3">Notification of Infringement</h2>
          <p className="text-default-600 leading-relaxed">
            It is our policy to respond to clear notices of alleged copyright infringement. 
            If you are a copyright owner or an agent thereof and you believe that any content hosted on our website 
            infringes your copyrights, then you may submit a notification pursuant to the Digital Millennium Copyright Act (&quot;DMCA&quot;).
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">Information Required</h2>
          <p className="text-default-600 leading-relaxed">
            To be effective, your notification must include:
          </p>
          <ul className="list-disc ml-6 mt-2 text-default-600 flex flex-col gap-2">
            <li>A physical or electronic signature of a person authorized to act on behalf of the owner of an exclusive right that is allegedly infringed.</li>
            <li>Identification of the copyrighted work claimed to have been infringed.</li>
            <li>Identification of the material that is claimed to be infringing or to be the subject of infringing activity.</li>
            <li>Information reasonably sufficient to permit us to contact you, such as an address, telephone number, and email address.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">Counter-Notification</h2>
          <p className="text-default-600 leading-relaxed">
            If you believe that your content that was removed (or to which access was disabled) is not infringing, 
            or that you have the authorization from the copyright owner, the copyright owner&apos;s agent, or pursuant to the law, 
            to post and use the material in your content, you may send a counter-notice.
          </p>
        </section>
      </div>
    </div>
  );
}
