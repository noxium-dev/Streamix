"use client";

import SectionTitle from "@/components/ui/other/SectionTitle";
import { Icon } from "@iconify/react";
import { Card, CardBody } from "@heroui/react";

export default function TosPage() {
  const sections = [
    {
      title: "Acceptance of Terms",
      icon: "solar:verified-check-bold-duotone",
      content: "By accessing and using Streamix, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you are prohibited from using or accessing this site. The materials contained in this website are protected by applicable copyright and trademark law."
    },
    {
      title: "Use License",
      icon: "solar:laptop-minimalistic-bold-duotone",
      content: "Permission is granted to temporarily access the materials (information or software) on Streamix's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:",
      list: [
        "Modify or copy the materials.",
        "Use the materials for any commercial purpose, or for any public display (commercial or non-commercial).",
        "Attempt to decompile or reverse engineer any software contained on the website.",
        "Remove any copyright or other proprietary notations from the materials.",
        "Transfer the materials to another person or 'mirror' the materials on any other server."
      ]
    },
    {
      title: "Content Disclaimer",
      icon: "solar:shield-warning-bold-duotone",
      content: "The materials on Streamix's website are provided on an 'as is' basis. Streamix makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.",
      subContent: "Furthermore, Streamix does not warrant or make any representations concerning the accuracy, likely results, or reliability of the use of the materials on its website or otherwise relating to such materials or on any sites linked to this site."
    },
    {
      title: "Limitations of Liability",
      icon: "solar:danger-bold-duotone",
      content: "In no event shall Streamix or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Streamix's website, even if Streamix or a Streamix authorized representative has been notified orally or in writing of the possibility of such damage."
    },
    {
      title: "Links to External Sites",
      icon: "solar:link-round-bold-duotone",
      content: "Streamix has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by Streamix of the site. Use of any such linked website is at the user's own risk."
    },
    {
      title: "Governing Law",
      icon: "solar:globus-bold-duotone",
      content: "These terms and conditions are governed by and construed in accordance with the laws of your jurisdiction and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location."
    }
  ];

  return (
    <div className="flex flex-col gap-8 py-6 min-h-[70vh] max-w-4xl mx-auto w-full px-4">
      <div className="flex flex-col gap-3">
        <SectionTitle>Terms of Service</SectionTitle>
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

              {section.subContent && (
                <p className="text-default-400 leading-relaxed font-medium italic text-sm mt-2 border-l-2 border-divider pl-4">
                  {section.subContent}
                </p>
              )}
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}
