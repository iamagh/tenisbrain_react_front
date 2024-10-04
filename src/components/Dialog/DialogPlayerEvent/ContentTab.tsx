import { FC, useState, useEffect } from "react";
import ContentAccordion from "components/CustomComponents/ContentAccordion";


interface DialogContentTabProps {
    groupEvent: any;
}

const DialogContentTab: FC<DialogContentTabProps> = ({ groupEvent }) => {


    return (
        <>
            {/* --- add content section */}
            <div>
                {/* <Label>Add Content</Label> */}
                <div className="mt-2 space-y-2">
                    <ContentAccordion
                        isCoach={false}
                        contents={groupEvent.content}
                        groupContent={groupEvent.content}
                    />
                </div>
            </div>
        </>
    )
}

export default DialogContentTab

