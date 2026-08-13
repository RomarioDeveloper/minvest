"use client";

import EditorialSpread from "@/components/EditorialSpread";
import RevealOnView from "@/components/RevealOnView";
import { useI18n } from "@/lib/i18n";
import { OBJECTS } from "@/lib/objects";

const SHUTTERS = ["shutter", "shutter-left", "shutter-right"] as const;

export default function ObjectsScrollSpreads() {
  const { t } = useI18n();
  const objects = OBJECTS(t);

  return (
    <div id="objects-gallery">
      {objects.map((obj, i) => {
        const meta = [
          { label: t("catalog.floors"), value: String(obj.floors) },
          { label: t("catalog.apartments"), value: String(obj.apartments) },
        ];
        if (obj.priceFrom) {
          meta.push({ label: t("catalog.price"), value: obj.priceFrom });
        }

        return (
          <div key={obj.slug} className="relative">
            <RevealOnView variant={SHUTTERS[i % SHUTTERS.length]} offset={0} as="div">
              <EditorialSpread
                imageSrc={obj.image}
                imageAlt={obj.name}
                eyebrow={obj.district}
                title={obj.name}
                body={obj.tagline}
                placement={i % 2 === 0 ? "bottom-left" : "bottom-right"}
                height="screen"
                meta={meta}
              />
            </RevealOnView>
          </div>
        );
      })}
    </div>
  );
}
