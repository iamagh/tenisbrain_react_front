import  { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { toast } from "react-toastify";
import ButtonSecondary from "shared/Button/ButtonSecondary";

import ExerciseTypeDialog from 'components/Dialog/ExerciseTypeDialog';
import Technical from "images/excercises/technical.png";
import Physical from "images/excercises/physical.png";
import Tactical from "images/excercises/tactical.png";
import Mental from "images/excercises/mental.png";
import Guide from "components/Guide/Guide";

import { getAllExerciseTypes, createExerciseType, deleteExerciseType, updateExerciseType } from "services/coach/exerciseTypes";

const TypeImages = [
  { key: 'Technical', img: Technical },
  { key: 'Physical', img: Physical },
  { key: 'Tactical', img: Tactical },
  { key: 'Mental', img: Mental },
]

const PageExercise = () => {
  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogData, setDialogData] = useState({});
  const [activeTab, setActiveTab] = useState('All');

  const exerciseTypes = [
    { key: 'All', name: 'All' },
    { key: 'Technical', name: 'Technical Exercise' },
    { key: 'Physical', name: 'Physical Exercise' },
    { key: 'Tactical', name: 'Tactical Exercise' },
    { key: 'Mental', name: 'Mental Exercise' },
  ];

  const handleOpenDialog = (type: any, oldData: any = {}) => {
    setDialogData({ type, ...oldData });
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllExerciseTypes(); // coach id
        setData(data);
        setLoading(false);
      } catch (err: any) {
        setError(err.message || 'An error occurred');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const onSubmit = async (newData: any) => {
    if (newData.id) { // edit Mode
      const res = await updateExerciseType(newData.id, newData);
      if (res) {
        setData({
          ...data,
          contents: data?.contents.map((item: any) => (item.id === newData.id ? { ...item, content: newData.content } : item)),
        });
      }
    } else {
      const res = await createExerciseType(newData);
      if (res) {
        setData({ ...data, contents: [...data.contents, res.result] });
      }
    }
  };

  const handleDelete = async (id: any) => {
    try {
      await deleteExerciseType(id);
      setData({ ...data, contents: data.contents.filter((item: any) => item.id !== id) });
    } catch (error) {
      toast.error('Delete failed');
    }
  };

  const renderProductItem = (item_data: any, index: any) => {
    const { content_type, name, description, content } = item_data;
    return (
      <div key={index} className="flex shadow rounded-xl border border-slate-200">
        <div className="h-16 w-16 sm:w-20 sm:h-20 flex-shrink-0 overflow-hidden rounded-l-xl bg-slate-100">
          <img src={TypeImages.find((type: any) => type.key == content_type)?.img} alt={name} className="h-full w-full object-cover object-center" />
        </div>
        <div className="ml-4 flex flex-1 flex-col justify-center">
          <div>
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-base font-medium line-clamp-1">{name}</h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  <span>{content}</span>
                </p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  <span>{description}</span>
                </p>
              </div>
              <div className="py-1 flex gap-2 mr-2">
                <ButtonSecondary sizeClass="py-2 px-4" onClick={() => handleOpenDialog(item_data.content_type, { id: item_data.id, type: item_data.content_type, content: item_data.content, description: item_data.description })}>
                  Edit
                </ButtonSecondary>
                <ButtonSecondary sizeClass="py-2 px-4" onClick={() => handleDelete(item_data.id)}>
                  Delete
                </ButtonSecondary>
              </div>
            </div>
          </div>
          {/* <div className="flex flex-1 items-end justify-between text-sm">
            <p className="text-gray-500 dark:text-slate-400 flex items-center">
              <span className="hidden sm:inline-block">Time</span>
              <span className="inline-block sm:hidden">Time</span>
              <span className="ml-2">20 mins</span>
            </p>
          </div> */}
        </div>
      </div>
    );
  };

  const renderExerciseTypes = () => {
  return (
    <div className="space-y-10 sm:space-y-12">
      <div className="flex space-x-8 md:space-x-14 overflow-x-auto hiddenScrollbar">
        {exerciseTypes.map((type) => (
          <button
            key={type.key}
            onClick={() => setActiveTab(type.key)}
            className={`block py-5 md:py-8 border-b-2 border-transparent flex-shrink-0 text-xl sm:text-2xl ${activeTab === type.key ? 'border-primary-500 font-medium text-slate-900 dark:text-slate-200' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}
          >
            {type.name}
          </button>
        ))}
      </div>
      <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden z-0">
        <ul className="list-disc">
          <li className="flex justify-between items-center p-2 sm:p-4 bg-slate-50 dark:bg-slate-500/5">
            <p className="text-lg font-semibold">{exerciseTypes.find((type) => type.key === activeTab)?.name}</p>
            {activeTab !== 'All' && (
              <ButtonSecondary sizeClass="py-2.5 px-4 sm:px-6" fontSize="text-sm font-medium" onClick={() => handleOpenDialog(activeTab)}>
                Add
              </ButtonSecondary>
            )}
          </li>
          <li className="border-t border-slate-200 flex flex-col gap-2 dark:border-slate-700 p-2 sm:p-4 divide-y divide-y-slate-200 dark:divide-slate-700">
            {data?.contents?.filter((item: any) => activeTab === 'All' || item.content_type === activeTab).map(renderProductItem)}
          </li>
        </ul>
      </div>
    </div>
  );
};

  return (
    <div className="nc-PagePlayerPlayers  min-h-[calc(100vh-5rem)]">
      <Helmet>
        <title>Coaches || Exercise</title>
      </Helmet>
      <div className="container min-h-[calc(100vh-5rem)] relative pt-5 pb-16 lg:pb-20 lg:pt-5">
        <Guide />
        {renderExerciseTypes()}
        <ExerciseTypeDialog isOpen={isDialogOpen} oldData={dialogData} onClose={handleCloseDialog} onSubmit={onSubmit} />
      </div>
    </div>
  );
};

export default PageExercise;
