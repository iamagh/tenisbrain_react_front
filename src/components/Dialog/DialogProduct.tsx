import React, { useState, useEffect } from 'react';
import Label from 'components/Label/Label';
import Input from 'shared/Input/Input';
import ButtonPrimary from 'shared/Button/ButtonPrimary';
import ButtonSecondary from 'shared/Button/ButtonSecondary';

type DialogProps = {
  isOpen: boolean;
  title: string;
  product: any;
  isEdit: boolean;
  defaultOption: any;
  setProduct: (param: any) => void;
  onClose: () => void;
  onSubmit: () => void;
};

const DialogProduct: React.FC<DialogProps> = ({ isOpen, title, onClose, onSubmit, product, setProduct, isEdit, defaultOption }) => {

  /**
   * 
   * @param e 
   */
  const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    setProduct({
      ...product,
      [e.currentTarget?.name]: e.currentTarget?.value
    });
  }

  const handleClose = () => {
    onSubmit();
    onClose();
  };

  useEffect(() => {
    if(!isEdit) {
      setProduct({
        ...product,
        "product": defaultOption.product,
        "price": defaultOption.price,
        "unit": defaultOption.unit,
        "discount_percent": defaultOption.discount_percent,
      });
    }
    console.log(product, isEdit)
  }, [isOpen]);

  return isOpen ? (
    <div className="fixed inset-0 flex items-center justify-center z-[1001]">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        <div className="max-w-lg xl:max-w-full">
          <Label className="text-sm">Product Name</Label>
          <Input
            className="mt-1.5"
            type={"text"}
            name="product"
            value={product.product}
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-col mt-3 sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
          <div className="sm:w-1/3">
            <Label className="text-sm">Hourly Rate</Label>
            <Input
              className="mt-1.5"
              placeholder="20.00"
              name="price"
              value={product.price} onChange={handleChange}
            />
          </div>
          <div className="flex-1">
            <Label className="text-sm">Unit</Label>
            <Input
              className="mt-1.5"
              placeholder="5"
              name="unit"
              value={product.unit}
              onChange={handleChange}
            />
          </div>
          <div className="flex-1">
            <Label className="text-sm">Unit Discount</Label>
            <Input
              className="mt-1.5"
              placeholder="00.00 %" 
              name="discount_percent"
              value={product.discount_percent}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="flex justify-end gap-4 mt-4">
          <ButtonPrimary
            type="submit"
            onClick={handleClose}
          >
            Save
          </ButtonPrimary>
          <ButtonSecondary
            onClick={onClose}
            type="submit"
          >
            Cancel
          </ButtonSecondary>
        </div>
        <button className="absolute top-0 right-0 mt-4 mr-4" onClick={onClose}>
          <svg className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  ) : null;
};

export default DialogProduct;

