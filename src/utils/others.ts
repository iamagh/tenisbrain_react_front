import { toast } from "react-hot-toast";

const converterDataParaDjangoFormat = (data: string) => {
    const dataJS = new Date(data);
    const year = dataJS.getFullYear();
    const month = (dataJS.getMonth() + 1).toString().padStart(2, '0');
    const day = dataJS.getDate().toString().padStart(2, '0');
    const hour = dataJS.getHours().toString().padStart(2, '0');
    const minute = dataJS.getMinutes().toString().padStart(2, '0');
    const second = dataJS.getSeconds().toString().padStart(2, '0');
    const formatoDjango = `${year}-${month}-${day} ${hour}:${minute}:${second}`;
    return formatoDjango;
}

const convertDateStringToYYMMDD = (dateString: string) => {
    const date = new Date(dateString);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');  // Months are 0-based in JavaScript
    const day = String(date.getDate()).padStart(2, '0');

    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
}

const loadingMessage = async (callApi: any, message: any = {
    loading: "Saving ...",
    success: "Saved Successfully",
    error: "Error while saving."
}) => {
    try {
        toast.loading(message.loading);
        const res = await callApi();
        if (res) {
            toast.dismiss();
            toast.success(message.success);
        }
    } catch (error) {
        toast.dismiss();
        toast.error(message.error);
    }
}

const clearStorage = () => {
    localStorage.setItem("user", '');
    localStorage.setItem("player-coach", '');
    localStorage.setItem("user-role", '');
    localStorage.setItem("access-token", '');
    localStorage.setItem("refresh-token", '');
    localStorage.setItem("user-info", '');
}

const updateProcess = (step: number) => {
    localStorage.setItem("signup-process", step.toString());
}

export {
    converterDataParaDjangoFormat,
    convertDateStringToYYMMDD,
    loadingMessage,
    clearStorage,
    updateProcess
}
