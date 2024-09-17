import { Dialog } from "@headlessui/react";
import { FC, useState, useEffect } from "react";
import Checkbox from "shared/Checkbox/Checkbox";
import ButtonPrimary from "shared/Button/ButtonPrimary";
import ButtonThird from "shared/Button/ButtonThird";
import { getAllAvailabilitys, updateAvailability } from "services/coach/availabilitys";
import { loadingMessage, convertDateStringToYYMMDD } from "utils/others";

import { useDispatch } from "react-redux";
import { setCoachAvailabilitys } from "store/coachSlice";

interface DialogCoachAvailabilityProps {
  isOpen: boolean;
  data: any;
  onOK: () => void;
  onClose: () => void;
  openDialogGroup: () => void;
  setGroupEventDialogData: (param: any) => void;
  dialogGroupData: any;
}

const DialogCoachAvailability: FC<DialogCoachAvailabilityProps> = ({ isOpen, data, onOK, onClose, openDialogGroup, setGroupEventDialogData, dialogGroupData }) => {
  const coachId = '';
  const eDate = new Date(data.date).toDateString();
  const dispatch = useDispatch();

  const [availabilitys, setAvailabilitys]: any = useState([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [groupEventData, setGroupEventData] = useState();
  const [availabilitysState, setAvailabilitysState] = useState<string[]>([]);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);


  useEffect(() => {
    const pickedDate = convertDateStringToYYMMDD(data.date);

    if (!isOpen) { return }

    const fetchData = async () => {
      try {
        const data = await getAllAvailabilitys(coachId, pickedDate);
        setAvailabilitys(data.availability);
        dispatch(setCoachAvailabilitys(data.availability));
        setLoading(false);
      } catch (err: any) {
        setError(err.message || 'An error occurred');
        setLoading(false);
      }
    };

    fetchData();

  }, [isOpen]);

  const handleChangeAvailabilitys = (checked: boolean, time: string) => {
    const dayIndex = (new Date(data.date).getDay() + 6) % 7;

    /** --- select all checkbox */
    if (time === "Select All") {
      const allChecked = availabilitys.map((avail: any) => ({
        ...avail,
        days: avail.days.map((day: any, index: number) => ({
          ...day,
          checked: index === dayIndex ? checked : day.checked,
        })),
      }));
      setAvailabilitys(allChecked);
    } else {
      const updatedData = availabilitys.map((avail: any) => {
        if (avail.time === time) {
          return {
            ...avail,
            days: avail.days.map((day: any, index: number) => ({
              ...day,
              checked: index === dayIndex ? checked : day.checked,
            })),
          };
        } else {
          return avail;
        }
      });
      setAvailabilitys(updatedData);
    }

    // checked
    // ? setAvailabilitysState([...availabilitysState, time])
    // : setAvailabilitysState(availabilitysState.filter((i) => i !== time));
  };

  /** --- show GroupClassModal */
  const showGruopEventModal = () => {
    onClose();
    setGroupEventDialogData({
      date: new Date(data.date),

    });
    openDialogGroup();
  }


  const isChecked = (time: string) => {
    const dayIndex = (data.date.getDay() + 6) % 7;

    const availability = availabilitys.find((item: any) => item.time == time);
    const checked = availability.days[dayIndex].checked;

    return checked;
  }

  /** --- save availability */
  const handleSubmit = async () => {
    const pickedDate = convertDateStringToYYMMDD(data.date);
    await loadingMessage(() => updateAvailability(availabilitys, pickedDate));
    dispatch(setCoachAvailabilitys(availabilitys));
  }

  return (
    <Dialog
      as="div"
      className="fixed inset-0 z-[1000] overflow-y-auto"
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
            AVAILABILITY of Day - {eDate}
          </Dialog.Title>

          <div className="mt-4">
            <div className="text-sm text-gray-500">

              <div className="relative flex flex-col px-5 py-6 space-y-5 h-[70vh] overflow-y-auto">
                <Checkbox
                  name="Select All"
                  label="Select All"
                  defaultChecked={availabilitysState.includes(
                    "Select All"
                  )}
                  onChange={(checked) =>
                    handleChangeAvailabilitys(checked, "Select All")
                  }
                />
                <div className="w-full border-b border-neutral-200 dark:border-neutral-700" />
                {availabilitys?.map((item: any) => (
                  <div key={item.time} className="">
                    <Checkbox
                      name={item.time}
                      label={item.time}
                      checked={isChecked(item.time)}
                      onChange={(checked) =>
                        handleChangeAvailabilitys(checked, item.time)
                      }
                    />
                  </div>
                ))}
              </div>
              <div className="p-5 bg-neutral-50 dark:bg-neutral-900 dark:border-t dark:border-neutral-800 flex items-center justify-between">
                <ButtonPrimary
                  onClick={handleSubmit}
                  sizeClass="px-4 py-2 sm:px-5"
                >
                  Apply
                </ButtonPrimary>
                <ButtonPrimary
                  sizeClass="px-4 py-2 sm:px-5"
                  onClick={() => showGruopEventModal()}
                >
                  Group<span className="hidden sm:inline"> Event</span>
                </ButtonPrimary>
                <ButtonThird
                  onClick={() => {
                    onClose();
                    setAvailabilitysState([]);
                  }}
                  sizeClass="px-4 py-2 sm:px-5"
                >
                  Cancel
                </ButtonThird>
              </div>
            </div>
          </div>
          {/* <div className="mt-4">
            <button
              type="button"
              className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-blue-500 border border-transparent rounded-md hover:bg-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
              onClick={onClose}
            >
              Close
            </button>
          </div> */}
        </div>
      </div>
    </Dialog>
  );
};

export default DialogCoachAvailability;
