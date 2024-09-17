import { Dialog } from "@headlessui/react";
import { FC, useState, useEffect } from "react";
import Label from "components/Label/Label";
import ButtonPrimary from "shared/Button/ButtonPrimary";
import Input from "shared/Input/Input";
import Select from "shared/Select/Select";
import Textarea from "shared/Textarea/Textarea";
import Checkbox from "shared/Checkbox/Checkbox";
import ButtonThird from "shared/Button/ButtonThird";
import { getAllAvailabilitys, updateAvailability } from "services/coach/availabilitys";
import { deleteMember, updateMember } from "services/player/members";

interface DialogPlayerMemberProps {
  isOpen: boolean;
  data?: any;
  onOK: (newData: any) => void;
  onClose: () => void;
}

const DialogPlayerMember: FC<DialogPlayerMemberProps> = ({ isOpen, data, onOK, onClose }) => {

  const [member, setMember] = useState({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {

    setMember({
      gender: 'Male',
      playing_hand: 'Right',
      ...data
    })

  }, [isOpen])

  const handleSubmit = async () => {

    onOK(member)
    // onClose()
  }
  const handleDelete =async () => {
    if( !data.id) {
      console.log('can not remove');
      return;
    }
    const res = await deleteMember(data.id);
    onClose();
  }
  return (
    <Dialog
      as="div"
      className="fixed inset-0 z-[1002] overflow-y-auto"
      open={isOpen}
      onClose={onClose}
    >
      <div className="min-h-screen px-4 text-center">
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />

        <span
          className="inline-block h-screen align-middle"
          aria-hidden="true"
        >
          &#8203;
        </span>

        <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
          <Dialog.Title
            as="h3"
            className="text-lg font-medium leading-6 text-gray-900"
          >
            Player Member
          </Dialog.Title>

          <div className="mt-4">
            <div className="text-sm text-gray-500">

              <div className="flex-grow mt-10 md:mt-0 max-w-3xl space-y-6">
                <div>
                  <Label>First Name</Label>
                  <Input className="mt-1.5" defaultValue={data.first_name} onChange={(e) => setMember({ ...member, first_name: e.target.value })}/>
                </div>
                <div>
                  <Label>Last Name</Label>
                  <Input className="mt-1.5" defaultValue={data.last_name} onChange={(e) => setMember({ ...member, last_name: e.target.value })}/>
                </div>
                <div>
                  <Label>Playing Hand</Label>
                  <Select className="mt-1.5" defaultValue={data.playing_hand } onChange={(e) => setMember({ ...member, playing_hand: e.target.value })}>
                    <option value="Right">Right</option>
                    <option value="Left">Left</option>
                  </Select>
                </div>
                <div>
                  <Label>Gender</Label>
                  <Select className="mt-1.5" defaultValue={data.gender} onChange={(e) => setMember({ ...member, gender: e.target.value })
                  }>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </Select>
                </div>
                <div className="max-w-lg">
                  <Label>Birthday</Label>
                  <div className="mt-1.5 flex">
                    <span className="inline-flex items-center px-2.5 rounded-l-2xl border border-r-0 border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 text-sm">
                      <i className="text-2xl las la-calendar"></i>
                    </span>
                    <Input
                      className="!rounded-l-none"
                      type="date"
                      defaultValue={data.date_of_birth}
                      onChange={(e) => setMember({ ...member, date_of_birth: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              <div className="p-5 bg-neutral-50 dark:bg-neutral-900 dark:border-t dark:border-neutral-800 flex items-center justify-between">
                <ButtonPrimary
                  onClick={handleSubmit}
                  sizeClass="px-4 py-2 sm:px-5"
                >
                  Apply
                </ButtonPrimary>
                <ButtonPrimary sizeClass="px-4 py-2 sm:px-5" onClick={handleDelete}>Delete</ButtonPrimary>
                <ButtonThird
                  onClick={() => {
                    onClose();
                  }}
                  sizeClass="px-4 py-2 sm:px-5"
                >
                  Cancel
                </ButtonThird>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default DialogPlayerMember;
