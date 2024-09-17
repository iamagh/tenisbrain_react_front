import { Disclosure } from "@headlessui/react";
import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import { FC, useEffect, useState } from "react";
import ContentReviewItem from "./ContentReviewItem";

const DEMO_DATA = [
  {
    name: "Physical Exercise",
    content: [],
    type: "Physical",
    isOpen: false,
  },
  {
    name: "Technical Exercise",
    content: [],
    type: "Technical",
    isOpen: false,
  },
  {
    name: "Tactical Exercise",
    content: [],
    type: "Tactical",
    isOpen: false,
  },
  {
    name: "Mental Exercise",
    content: [],
    type: "Mental",
    isOpen: false,
  },
];

interface Props {
  panelClassName?: string;
  data?: typeof DEMO_DATA;
  groupContent: any;
  contents: any;
  isCoach?: boolean;
  handleContent?: any;
}

const ContentAccordion: FC<Props> = ({
  panelClassName = "p-4 pt-3 last:pb-0 text-slate-600 text-sm dark:text-slate-300 leading-6",
  data = DEMO_DATA,
  groupContent = [],
  contents,
  isCoach = true,
  handleContent = () => {},
}) => {
  const [contentData, setContentData] = useState<any[]>([]);

  useEffect(() => {
    const newData = data.map((item: any) => {
      const some = contents.filter((citem: any) => citem.content_type === item.type);
      if (isCoach) {
        const updatedContent = some.map((contentItem: any) => {
          const correspondingGroupContent = groupContent.find((groupItem: any) => groupItem.id === contentItem.id);
          if (correspondingGroupContent) {
            // Update the score field of contentItem using correspondingGroupContent
            contentItem.score = correspondingGroupContent.score;
          }
          return contentItem;
        });
        return {
          ...item,
          content: updatedContent.length ? [...item.content, ...updatedContent] : item.content,
          isOpen: updatedContent.length ? true : false,
        }
      } else {
        return {
          ...item,
          content: some.length ? [...item.content, ...some] : item.content,
          isOpen: true,
        }
      }
    });
    setContentData(newData);
    return () => {
      setContentData([]);
    };
  }, []);

  return (
    <div className="w-full rounded-2xl space-y-2.5">
      {/* ============ */}
      {contentData.map((item, index) => {
        return (
          item.content.length > 0 && <Disclosure key={index} defaultOpen={item.isOpen}>
            {({ open }) => (
              <>
                <Disclosure.Button className="flex items-center justify-between w-full px-4 py-2 font-medium text-left bg-slate-100/80 hover:bg-slate-200/60 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg focus:outline-none focus-visible:ring focus-visible:ring-slate-500 focus-visible:ring-opacity-75 ">
                  <span>{item.name}</span>
                  {!open ? (
                    <PlusIcon className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                  ) : (
                    <MinusIcon className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                  )}
                </Disclosure.Button>
                <Disclosure.Panel
                  className={panelClassName}
                >
                  {
                    item.content.map((itemContent: any, rIndex: number) => (
                      <ContentReviewItem
                        key={rIndex}
                        defaultChecked={groupContent.some((cItem: any) => cItem.id === itemContent.id)}
                        coachFlag={isCoach}
                        data={itemContent}
                        handleContent={handleContent}
                      />
                    ))
                  }
                </Disclosure.Panel>
              </>
            )
            }
          </Disclosure>
        );
      })}

      {/* ============ */}
    </div >
  );
};

export default ContentAccordion;
