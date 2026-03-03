"use client";

import SectionTitle from "@/components/ui/other/SectionTitle";
import { Icon } from "@iconify/react";
import { Card, CardBody } from "@heroui/react";

export default function DmcaPage() {
  const sections = [
    {
      title: "Notification of Infringement",
      icon: "solar:shield-warning-bold-duotone",
      content: "Streamix respects the intellectual property rights of others. In accordance with the Digital Millennium Copyright Act (DMCA), we will respond expeditiously to claims of copyright infringement that are reported to our designated agent. If you believe that your copyrighted work has been copied in a way that constitutes copyright infringement, please provide our agent with a written notice containing the required information."
    },
    {
      title: "Content Policy",
      icon: "solar:document-text-bold-duotone",
      content: "Please note that Streamix does not host any videos on its own servers. All content provided is hosted by third-party services. We act as a search engine and organizer for publicly available content. However, we take infringement seriously and will remove links to infringing material from our platform upon receiving a valid DMCA notice."
    },
    {
      title: "Information Required",
      icon: "solar:info-circle-bold-duotone",
      list: [
        "A physical or electronic signature of the copyright owner or a person authorized to act on their behalf.",
        "Identification of the copyrighted work claimed to have been infringed.",
        "Identification of the material that is claimed to be infringing and information reasonably sufficient to permit us to locate the material (e.g., direct links).",
        "Your contact information, including your address, telephone number, and an email address.",
        "A statement that you have a good faith belief that use of the material in the manner complained of is not authorized by the copyright owner, its agent, or the law.",
        "A statement that the information in the notification is accurate, and under penalty of perjury, that you are authorized to act on behalf of the copyright owner."
      ]
    },
    {
      title: "Counter-Notification",
      icon: "solar:reply-bold-duotone",
      content: "If you believe that your content was removed by mistake or misidentification, you may submit a counter-notification to our agent. To be effective, the counter-notification must be a written communication that includes your physical or electronic signature, identification of the material that has been removed, and a statement under penalty of perjury that you have a good faith belief that the material was removed as a result of mistake."
    },
    {
      title: "Repeat Infringer Policy",
      icon: "solar:user-block-bold-duotone",
      content: "In accordance with the DMCA and other applicable law, Streamix has adopted a policy of terminating, in appropriate circumstances and at our sole discretion, users or account holders who are deemed to be repeat infringers."
    }
  ];

  return (
    <div className="flex flex-col gap-8 py-6 min-h-[70vh] max-w-4xl mx-auto w-full px-4">
      <div className="flex flex-col gap-3">
        <SectionTitle>DMCA Policy</SectionTitle>
        <div className="flex items-center gap-2 text-default-400 font-medium text-sm">
          <Icon icon="solar:calendar-bold-duotone" width={16} />
          <span>Last updated: March 3, 2026</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {sections.map((section, index) => (
          <Card key={index} className="bg-secondary-background/40 border-1 border-divider/50 shadow-none">
            <CardBody className="p-6 flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary shadow-inner border-1 border-primary/20">
                  <Icon icon={section.icon} width={24} />
                </div>
                <h2 className="text-xl font-bold tracking-tight text-foreground uppercase">{section.title}</h2>
              </div>
              
              {section.content && (
                <p className="text-default-500 leading-relaxed font-medium">
                  {section.content}
                </p>
              )}

              {section.list && (
                <ul className="flex flex-col gap-3 ml-1">
                  {section.list.map((item, i) => (
                    <li key={i} className="flex gap-3 text-default-500 font-medium leading-relaxed">
                      <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}
