import httpStatus from "http-status";
import { cloudinaryHelper } from "../../cloudinary/cloudinaryHelper";
import ErrorHandler from "../../utils/ErrorHandler";
import { TBanner, TData, TLayout } from "./layout.interface";
import { Layout } from "./layout.model";

const createLayout = async (payload: TData) => {
  const { type, bannerTitle, faq, categories } = payload;

  const typeExist = await Layout.findOne({ type });
  if (typeExist)
    throw new ErrorHandler(httpStatus.BAD_REQUEST, `${type} already exist`);

  let result = null;

  if (type === "banner") {
    if ( !bannerTitle)
      throw new ErrorHandler(
        httpStatus.BAD_REQUEST,
        `Please provide all information`
      );

    result = await Layout.create({
      type: type,
      banner: {
        title: bannerTitle,
      },
    });
  }

  if (type === "faq") {
    if (faq.length < 1)
      throw new ErrorHandler(
        httpStatus.BAD_REQUEST,
        `Please provide questiona and answers`
      );

    result = await Layout.create({
      type: type,
      faq,
    });
  }
  if (type === "categories") {
    if (categories.length < 1)
      throw new ErrorHandler(
        httpStatus.BAD_REQUEST,
        `Please provide needed information`
      );

    result = await Layout.create({
      type: type,
      categories,
    });
  }

  return result;
};

const updateBanner = async (payload: TData) => {
  const { type, bannerTitle } = payload;

  const typeExist = await Layout.findOne({ type });
  if (!typeExist)
    throw new ErrorHandler(httpStatus.BAD_REQUEST, `${type} doesn't exist`);

  let result = null;

  if (type === "banner") {
    const banner = {
      type: type,
      banner: {
        title: bannerTitle ? bannerTitle : typeExist.banner.title,
        
      },
    };

    result = await Layout.findOneAndUpdate({ type }, banner, { new: true });
  }

  return result;
};
const editLayout = async (payload: TData) => {
  const { type, categories, faq } = payload;

  const typeExist = await Layout.findOne({ type });
  if (!typeExist)
    throw new ErrorHandler(httpStatus.BAD_REQUEST, `${type} doesn't exist`);

  let result = null;
  if (type === "faq") {
    if (faq.length < 1)
      throw new ErrorHandler(
        httpStatus.BAD_REQUEST,
        `Please provide question  and answers`
      );

    const newFaq = {
      type: type,
      faq: faq,
    };

    result = await Layout.findOneAndUpdate({ type }, newFaq, { new: true });
  }

  if (type === "categories") {
    if (categories.length < 1)
      throw new ErrorHandler(
        httpStatus.BAD_REQUEST,
        `Please provide needed information`
      );

    const newCategories = {
      type: type,
      categories: categories,
    };

    result = await Layout.findOneAndUpdate({ type }, newCategories, {
      new: true,
    });
  }

  return result;
};

const getLayout = async (type: string) => {
  const result = await Layout.findOne({ type });

  return result;
};

export const LayoutService = {
  createLayout,
  updateBanner,
  editLayout,
  getLayout,
};
