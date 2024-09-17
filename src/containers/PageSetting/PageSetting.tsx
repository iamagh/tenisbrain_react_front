import React, { FC, useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import { saveSettings } from "services/setting";

import MySwitch from "components/MySwitch";
import Label from "components/Label/Label";

import ButtonPrimary from "shared/Button/ButtonPrimary";
import Input from "shared/Input/Input";
import Prices from "components/Prices";

import { updateSignupProcess, getSignupProcess } from "services/setting";
import { updateProcess } from "utils/others";

import DialogProduct from "components/Dialog/DialogProduct";

import { getAllProducts, deleteProduct, saveProduct } from "services/shared/product";
import { coachOnboard } from "services/shared/payment";

export interface AccountPageProps {
  className?: string;
}

const AccountPage: FC<AccountPageProps> = ({ className = "" }) => {
  const navigate = useNavigate();
  const userRole = localStorage.getItem("user-role");
  const userData: any = localStorage.getItem('user-info');
  const userId = localStorage.getItem("user") || "-1";
  // gettting coach guide
  const [showGuide, setShowGuide] = useState(false);
  const coachGuide = localStorage.getItem('singup-process') || '0';
  const [signupProcess, setSignupProcess] = useState(Number(coachGuide));

  const [isBookEnable, setIsBookEnable] = useState<boolean>(false);
  const [isChatEnable, setIsChatEnable] = useState<boolean>(false);
  const [isPaymentEnable, setIsPaymentEnable] = useState<boolean>(false);

  const [coachEmail, setCoachEmail] = useState("");

  const [isProductDialog, setIsProductDialog] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const [dialogTitle, setDialogTitle] = useState("Create Product");
  const [defaultOption, setDefaultOption] = useState({
    "type": "default",
    "option": "default",
    "product": "New Product",
    "discount_percent": "0",
    "price": "0",
    "unit": "0",
  });
  const [products, setProducts] = useState<any[]>([]);
  const [product, setProduct] = useState<any>({
    "id": "0",
    "product": "",
    "discount_percent": "0",
    "price": "0",
    "unit": "0",
  });
  const [rate, setRate] = useState<string>("0.00");

  const handleCloseDialog = () => {
    setIsProductDialog(false);
    clearProductForm();
  }
  const [showPaymentPrompt, setShowPaymentPrompt] = useState(true);

  useEffect(() => {
    if (showGuide) {
      if (signupProcess === 2)
        toast("Do you want to receive payments online?", { className: 'bg-blue-500 text-white font-bold py-2 px-4 rounded', autoClose: 5000 });
      if (signupProcess === 3)
        toast("Please set your hourly rate and any discounts for multiple bookings", { className: 'bg-blue-500 text-white font-bold py-2 px-4 rounded', autoClose: 5000 });

    }
  }, [showGuide]);

  useEffect(() => {
    if (userRole === 'coach') {
      const getProcess = async () => {
        const res = await getSignupProcess();
        setSignupProcess(res.signup_process);
        if (res.signup_process > 0 && userRole === 'coach') {
          setShowGuide(true);
        }
      }
      getProcess();
    }
    if (userData) {
      const userInfo = JSON.parse(userData);
      setCoachEmail(userInfo.email);
      setIsBookEnable(userInfo.enable_event_book_notify === "enabled");
      setIsChatEnable(userInfo.enable_chat_notify === "enabled");
      if (userRole === "coach") {
        setIsPaymentEnable(userInfo.enable_payment === "enabled");
        setRate(userInfo.rate);
      }
      const fetchProducts = async () => {
        const res = await getAllProducts(userId);
        if (res) {
          setProducts(res.products);
          // set defaultProduct price and percent
          const defaultProduct = res.products.find((item: any) => item.type == "default");
          if (defaultProduct) {
            setDefaultOption({
              ...defaultOption,
              "discount_percent": defaultProduct.discount_percent,
              "price": defaultProduct.price,
              "unit": defaultProduct.unit
            });
          }
        }
      }
      fetchProducts();
    }

  }, []);



  /**
   *
   * @param id string
   *
   */
  const handleDeleteProduct = async (id: string) => {
    try {
      const res = await deleteProduct(id);
      if (res) {
        toast.success("The product was removed");
        setProducts((prev) => prev.filter((product: any) => product.id != id));
      }
    } catch (error: any) {
      toast.error(error.message || "The error occurs while deleting product");
    }
  }

  /**
   *
   * @param e InputChange
   */
  const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    setDefaultOption({
      ...defaultOption,
      [e.currentTarget?.name]: e.currentTarget?.value
    });
  }

  /**
   *
   * Create New Product
   */
  const createProduct = () => {
    setIsEdit(false);
    clearProductForm();
    setDialogTitle("Create Product");
    setIsProductDialog(true);
  }

  /**
   *
   * return request to save Product
   */
  const handleSaveProduct = async () => {
    try {
      if (product.product !== "" && product.product.length > 4) {
        const res = await saveProduct(userId, product);
        if (res) {
          toast.success("The product was saved.");
          if (product?.id == 0) {

            setProducts([
              ...products,
              res.data
            ]);
          } else {
            setProducts([
              ...products.map((item: any) => {
                if (item.id == product.id) return res.data;
                else return item;
              })
            ]);
          }
          clearProductForm();
        }
      } else toast.info("Please input product name.");
    } catch (error: any) {
      toast.error(error.message || "The error occurs while saving product")
    }
  }


  const clearProductForm = () => {
    setProduct({
      "id": "0",
      "product": "",
      "discount_percent": "0",
      "price": "0",
      "status": "enabled",
    })
  }

  const handleOnboard = async () => {

    try {
      const response = await coachOnboard(coachEmail);
      console.log('response', response)
      window.location.href = response.data.url;
    } catch (error: any) {
      toast.error(error)
    }
    /**
     * Start Coach Guide
     */
    if (signupProcess > 0) {
      const res = await updateSignupProcess({ signup_process: 4 });
      if (res) {
        setSignupProcess(4);
        updateProcess(4);
      }
    }
    /** end */
  }

  /**
   *
   * @param e FormSubmit
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data: any = {
      'user_role': userRole,
      'enable_book': isBookEnable ? "enabled" : "disabled",
      'enable_chat': isChatEnable ? "enabled" : "disabled"
    }
    const newData = {
      ...JSON.parse(userData),
      "enable_event_book_notify": data.enable_book,
      "enable_chat_notify": data.enable_chat,
    }
    if (userRole === 'coach') {
      /**
       * Start Coach Guide
       */
      if (signupProcess > 0) {
        const res = await updateSignupProcess({ signup_process: 0 });
        if (res) {
          toast("You are now ready to receive bookings from your students.", { className: 'bg-blue-500 text-white font-bold py-2 px-4 rounded', autoClose: 5000 });
          setSignupProcess(0);
          updateProcess(0)
          setShowGuide(false)
          setTimeout(() => {
            navigate('/calendar');
          }, 500);
        }
      }
      /** end */
      data.enable_payment = isPaymentEnable ? "enabled" : "disabled";
      data.rate = defaultOption.price;
      newData.enable_payment = data.enable_payment;
      newData.rate = data.rate
    }
    try {
      const res = await saveSettings(data);
      const p_res = await saveProduct(userId, defaultOption);

      if (res && p_res) {
        // set LocalStorage
        const convertedNewData = JSON.stringify(newData);
        localStorage.setItem('user-info', convertedNewData);
        setProducts([
          ...products.map((item: any) => {
            if (item.type == "default") return {
              ...item,
              "discount_percent": defaultOption.discount_percent,
              "price": defaultOption.price,
              "unit": defaultOption.unit,
            };
            else return item;
          })
        ]);
        toast.success('Pricing is saved.');
      }
    } catch (error: any) {
      toast.error(error.message || 'Server had an issue right now.');
    }
  }

  // Save Options by Switch
  const handleToogleOptions = async (type: string) => {
    if (type === 'payment') {
      setIsPaymentEnable(!isPaymentEnable);
      /**
       * Start Tour option
       */
      if (signupProcess > 0) {
        const res = await updateSignupProcess({ signup_process: 3 })
        if (res) {
          setSignupProcess(3)
          updateProcess(3)
        }
      }
      /** end */
    }
    if (type === 'book') setIsBookEnable(!isBookEnable);
    if (type === 'chat') setIsChatEnable(!isChatEnable);
    const data: any = {
      'user_role': userRole,
      'enable_book': type === 'book' ? (!isBookEnable ? "enabled" : "disabled") : (isBookEnable ? "enabled" : "disabled"),
      'enable_chat': type === 'chat' ? (!isChatEnable ? "enabled" : "disabled") : (isChatEnable ? "enabled" : "disabled")
    }
    const newData = {
      ...JSON.parse(userData),
      "enable_event_book_notify": data.enable_book,
      "enable_chat_notify": data.enable_chat,
    }
    if (userRole == 'coach') {

      data.enable_payment = type === 'payment' ? (!isPaymentEnable ? "enabled" : "disabled") : (isPaymentEnable ? "enabled" : "disabled");
      data.rate = defaultOption.price;
      newData.enable_payment = data.enable_payment;
      newData.rate = data.rate
    }

    try {
      const res = await saveSettings(data);
      if (res) {
        // set LocalStorage
        const convertedNewData = JSON.stringify(newData);
        localStorage.setItem('user-info', convertedNewData);
      }
    } catch (error: any) {
      toast.error(error.message || 'Server had an issue right now.');
    }
  }

  const handlePaymentResponse = async (response: string) => {
    if (response === 'YES') {
      handleToogleOptions('payment');
      // Navigate to Stripe connect setup
      // e.g., redirect to /stripe-connect
    } else {
      toast("You are now ready to receive bookings from your students.", { className: 'bg-blue-500 text-white font-bold py-2 px-4 rounded', autoClose: 5000 });

      if (userRole === 'coach') {
        setShowGuide(false);
        const res = await updateSignupProcess({ signup_process: 0 });
        if (res) {
          setSignupProcess(0)
          updateProcess(0)
        }
      }

      navigate('/calendar');
      setIsPaymentEnable(false);
      // Directly navigate to calendar page
      // e.g., redirect to /calendar
    }
    setShowPaymentPrompt(false);
  };

  /**
   *
   * @returns DebitCredit component
   *
   */
  const renderDebitCredit = () => {
    return (
      <div className="flex-1 border-slate-200 border rounded-xl p-4 w-full sm:w-[1/2]">
        <label
          htmlFor="Credit-Card"
          className="flex items-center space-x-4 sm:space-x-6"
        >
          <div
            className="p-2.5 rounded-xl border-2 border-slate-600 dark:border-slate-300"
          >
            <svg
              className="w-6 h-6 sm:w-7 sm:h-7"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M2 12.6101H19"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M19 10.28V17.43C18.97 20.28 18.19 21 15.22 21H5.78003C2.76003 21 2 20.2501 2 17.2701V10.28C2 7.58005 2.63 6.71005 5 6.57005C5.24 6.56005 5.50003 6.55005 5.78003 6.55005H15.22C18.24 6.55005 19 7.30005 19 10.28Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M22 6.73V13.72C22 16.42 21.37 17.29 19 17.43V10.28C19 7.3 18.24 6.55 15.22 6.55H5.78003C5.50003 6.55 5.24 6.56 5 6.57C5.03 3.72 5.81003 3 8.78003 3H18.22C21.24 3 22 3.75 22 6.73Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M5.25 17.8101H6.96997"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M9.10986 17.8101H12.5499"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <p className="font-medium">Debit / Credit Card</p>
        </label>

        <div
          className={`mt-6 space-y-3 sm:space-y-5`}
        >
          <div className="max-w-lg xl:max-w-full">
            <Label className="text-sm">Card number</Label>
            <Input className="mt-1.5" type={"text"} />
          </div>
          <div className="max-w-lg xl:max-w-full">
            <Label className="text-sm">Name on Card</Label>
            <Input className="mt-1.5" />
          </div>
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
            <div className="sm:w-2/3">
              <Label className="text-sm">Expiration date (MM/YY)</Label>
              <Input className="mt-1.5" placeholder="MM/YY" />
            </div>
            <div className="flex-1">
              <Label className="text-sm">CVC</Label>
              <Input className="mt-1.5" placeholder="CVC" />
            </div>
          </div>
        </div>
      </div>
    )
  }
  /**
   *
   * @param discount string
   *
   * @returns component
   */
  const discountPercent = (discount: string, unit: number) => {
    return (
      <div className="relative rounded-md">
        <span className="absolute inset-y-0 right-2 flex items-center pointer-events-none text-neutral-500 sm:text-sm">
          %
        </span>
        <input
          type="text"
          name="minPrice"
          disabled
          id="minPrice"
          className="block w-20 pr-5 py-1 pl-4 sm:text-sm border-neutral-700 dark:border-neutral-700 bg-transparent"
          value={`${unit} x ${discount}`}
        />
      </div>
    )
  }

  /**
   *
   * @param id Product
   */
  const handleEditProduct = (id: any) => {
    setIsEdit(true);
    setDialogTitle("Update Product");
    setIsProductDialog(true);
    setProduct({
      ...products.find((item: any) => item.id == id)
    });
  }

  const handleSwitch = async (id: any) => {
    const filteredProduct = products.find((item: any) => item.id == id);
    filteredProduct.status = filteredProduct.status == "enabled" ? "disabled" : "enabled";
    try {
      const res = await saveProduct(userId, filteredProduct);
      if (res) {
        toast.success("The product was saved.");
        setProducts([
          ...products.map((item: any) => {
            if (item.id == filteredProduct.id) return res.data;
            else return item;
          })
        ]);
        clearProductForm();
      } else toast.info("Please input product name.");
    } catch (error: any) {
      toast.error(error.message || "The error occurs while saving product")
    }
  }

  const renderProduct = (item: any, index: number) => {
    const { id, price, product, discount_percent, status, type, unit } = item;

    return (
      <div
        key={index}
        className="relative flex py-2 sm:py-3 xl:py-4 first:pt-0 last:pb-0"
      >
        <div className="flex flex-1 flex-col">
          <div>
            <div className="flex justify-between">
              <div className="flex-[2.5] ">
                <h3 className="text-base font-semibold">
                  {/* {product} */}
                  <MySwitch
                    className={`items-start ${type == "default" ? "text-sky-500" : "text-green-500"}`}
                    label={product}
                    desc=""
                    enabled={status == "enabled"}
                    onChange={() => handleSwitch(id)}
                  />
                </h3>

                <div className="mt-3 l-4 flex justify-end gap-4 w-full lg:hidden relative">
                  {discountPercent(discount_percent, unit)}
                  <Prices
                    contentClass={`py-1 px-2 md:py-1.5 md:px-2.5 text-sm font-medium h-full ${type == "default" ? "border-sky-500 text-sky-500" : ""}`}
                    price={price * 1}
                  />
                </div>
              </div>
              <div className="hidden flex-1 lg:flex justify-end mr-4">
                <Prices
                  price={price * 1}
                  contentClass={`py-1 px-2 md:py-1.5 md:px-2.5 text-sm font-medium h-full ${type == "default" ? "border-sky-500 text-sky-500" : ""}`}
                  className="mt-0"
                />
              </div>
              <div className="hidden lg:block text-center relative">
                {discountPercent(discount_percent, unit)}
              </div>
            </div>
          </div>
          <div className="flex mt-auto items-end justify-end gap-4 text-sm">
            <button
              onClick={() => handleEditProduct(id)}
              className="relative z-10 mt-0.5 flex items-center font-medium text-sky-400 hover:text-sky-500 text-sm "
            >
              <span>Edit</span>
            </button>
            <button
              onClick={() => handleDeleteProduct(id)}
              className="relative z-10 mt-0.5 flex items-center font-medium text-red-400 hover:text-red-500 text-sm "
            >
              <span>Remove</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`nc-AccountPage min-h-[calc(100vh-5rem)] container ${className}`} data-nc-id="AccountPage">
      <Helmet>
        <title>Settings || TennisBrain </title>
      </Helmet>
      {
        showGuide && <div className="fixed z-[1000] w-full h-full top-0 left-0 bg-[rgba(0,0,0,.5)]"></div>
      }
      <div className="mt-14 sm:mt-20">
        <div className="w-full">
          <div className="max-w-2xl">
            <h2 className="text-3xl xl:text-4xl font-semibold">Settings</h2>
          </div>
          <hr className="mt-10 border-slate-200 dark:border-slate-700"></hr>
          <div className="flex flex-col md:flex-row my-10">
            <form onSubmit={handleSubmit} className="w-full md:w-1/2">
              <div className="space-y-10 sm:space-y-12">
                {/* HEADING */}
                <div className="flex flex-col md:flex-row">
                  <div className="flex-grow mt-10 md:mt-0 max-w-6xl space-y-6">
                    <div>
                      <MySwitch
                        label="Booking Notification"
                        desc="Get email notifications when book/class changes"
                        onChange={(e) => handleToogleOptions('book')}
                        enabled={isBookEnable}
                      // onChange={setIsBookEnable}
                      />
                    </div>
                    <div>
                      <MySwitch
                        label="Chat Notification"
                        desc="Get email notifications when new chat"
                        enabled={isChatEnable}
                        onChange={(e) => handleToogleOptions('chat')}
                      // onChange={setIsChatEnable}F
                      />
                    </div>
                    {
                      userRole == 'coach' && <>
                        {/* ---- */}
                        <div
                          className={`${showGuide && signupProcess === 2 ? 'relative z-[1001] bg-white border-4 border-red-400' : ''}`}
                        >
                          {showPaymentPrompt && (
                            <div className="modal absolute rounded-xl bg-white p-4 bottom-[calc(100%+10px)] right-0">
                              <p className="mb-2">Do you want to enable online payments?</p>
                              <div className="flex gap-2 justify-end">
                                <ButtonPrimary className="py-1 px-2" onClick={() => handlePaymentResponse('YES')}>Yes</ButtonPrimary>
                                <ButtonPrimary className="py-1 px-2" onClick={() => handlePaymentResponse('NO')}>No</ButtonPrimary>
                              </div>
                            </div>
                          )}
                          <MySwitch
                            label="Online Payment"
                            desc="Enable Online Payment when players book"
                            enabled={isPaymentEnable}
                            onChange={(e) => handleToogleOptions('payment')}
                          />
                        </div>
                        {
                          isPaymentEnable && <>
                            <ButtonPrimary type="button" className={`${showGuide && signupProcess === 3 ? 'z-[1001] border-4 border-red-400' : ''}`} onClick={handleOnboard}>Connect with Stripe</ButtonPrimary>
                            <div className={`flex gap-2`}>
                              <div className="w-1/3">
                                <Label>Hourly Rate</Label>
                                <Input
                                  name="price"
                                  className={`mt-1.5  relative ${showGuide && signupProcess === 4 ? 'z-[1001] border-4 border-red-400' : ''}`}
                                  placeholder="40.00"
                                  value={defaultOption.price}
                                  onChange={handleChange}
                                />
                              </div>
                              <div className="w-1/3">
                                <Label>Unit</Label>
                                <Input
                                  name="unit"
                                  className={`mt-1.5  relative ${showGuide && signupProcess === 4 ? 'z-[1001] border-4 border-red-400' : ''}`}
                                  placeholder="40.00"
                                  value={defaultOption.unit}
                                  onChange={handleChange}
                                />
                              </div>
                              <div className="w-1/3">
                                <Label>Unit Discount</Label>
                                <Input
                                  name="discount_percent"
                                  className={`mt-1.5  relative ${showGuide && signupProcess === 4 ? 'z-[1001] border-4 border-red-400' : ''}`}
                                  placeholder="40.00"
                                  value={defaultOption.discount_percent}
                                  onChange={handleChange}
                                />
                              </div>
                            </div>
                            {/* <div className="flex flex-col sm:flex-row">
                              {renderDebitCredit()}
                            </div> */}
                            <div className="pt-2">
                              <ButtonPrimary className={`${showGuide && signupProcess === 4 ? 'z-[1001] border-4 border-red-400' : ''}`} type="submit">Save Pricing</ButtonPrimary>
                            </div>
                          </>
                        }
                      </>
                    }
                  </div>
                </div>
              </div>
            </form>
            {
              userRole == 'coach' && <div className="w-full md:w-1/2 ml-0">
                <div className="mt-4 md:mt-0 md:ml-4 border-slate-200 border rounded-xl p-4 ">
                  <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold">Product Offering</h1>
                    <div className="flex gap-2">
                      <ButtonPrimary onClick={createProduct} sizeClass="py-2 px-4">Add Product</ButtonPrimary>
                    </div>
                  </div>
                  <hr />
                  <div className="mt-4 divide-y divide-slate-200 ">
                    {products.filter((item: any) => item.type == "default").map(renderProduct)}
                    {products.filter((item: any) => item.type != "default").map(renderProduct)}
                  </div>
                </div>
              </div>
            }
          </div>
        </div>
      </div>
      <DialogProduct
        isOpen={isProductDialog}
        product={product}
        defaultOption={defaultOption}
        isEdit={isEdit}
        setProduct={setProduct}
        onSubmit={handleSaveProduct}
        title={dialogTitle}
        onClose={handleCloseDialog}
      />
    </div>
  );
};

export default AccountPage;
