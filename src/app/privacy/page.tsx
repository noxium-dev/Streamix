"use client";

import SectionTitle from "@/components/ui/other/SectionTitle";
import { Icon } from "@iconify/react";
import { Card, CardBody } from "@heroui/react";

export default function PrivacyPage() {
  const sections = [
    {
      title: "Information Collection",
      icon: "solar:user-id-bold-duotone",
      content: "We collect information from you when you visit our site, browse our collection, or interact with our features. This may include technical data such as your IP address, browser type, device information, and browsing patterns. We do not require users to register accounts to browse or use our basic streaming organization features."
    },
    {
      title: "How We Use Information",
      icon: "solar:settings-minimalistic-bold-duotone",
      content: "The information we collect is used to enhance your experience, improve our website performance, and maintain the security of our platform. Specifically, we use it to:",
      list: [
        "Personalize your experience and remember your preferences (e.g., Favourites).",
        "Improve our website based on feedback and usage statistics.",
        "Detect, prevent, and address technical issues or security threats.",
        "Comply with legal obligations and protect our rights."
      ]
    },
    {
      title: "Cookies and Tracking",
      icon: "solar:cookie-bold-duotone",
      content: "Streamix uses cookies and similar tracking technologies to track activity on our service and hold certain information. Cookies are files with a small amount of data which may include an anonymous unique identifier. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent."
    },
    {
      title: "Third-Party Services",
      icon: "solar:link-bold-duotone",
      content: "Our website contains links to other sites that are not operated by us. If you click on a third-party link (such as video hosting providers), you will be directed to that third party's site. We strongly advise you to review the Privacy Policy of every site you visit. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party sites or services."
    },
    {
      title: "Data Security",
      icon: "solar:shield-check-bold-duotone",
      content: "The security of your data is important to us, but remember that no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your personal information, we cannot guarantee its absolute security."
    },
    {
      title: "Changes to This Policy",
      icon: "solar:refresh-bold-duotone",
      content: "We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes."
    }
  ];

  return (
    <div className="flex flex-col gap-8 py-6 min-h-[70vh] max-w-4xl mx-auto w-full px-4">
      <div className="flex flex-col gap-3">
        <SectionTitle>Privacy Policy</SectionTitle>
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
