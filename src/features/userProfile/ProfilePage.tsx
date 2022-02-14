import React, { useEffect, useMemo, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import countryList from "react-select-country-list";
import useFetch from "use-http";

import { env } from "@/lib/envConfig";

import Commission from "@/components/Commission";
import Toggle from "@/components/toggles/toggle";

import DashboardLayout from "@/layouts/DashboardLayout";

import { defaultProfile, UserProfile } from "./constants";

export default function Profile() {
  const [loaderVisible, setLoaderVisible] = useState(false);
  const [formValues, setFormValues] = useState(defaultProfile);
  const commissionValue = formValues[formValues?.commissionType];
  const [savedMessage, setSavedMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm();

  const countryOptions = useMemo(() => countryList().getData(), []);
  const { get, post, put, response, loading, error } = useFetch(env.BASE_URL);

  const onSubmit: SubmitHandler<UserProfile> = async (data) => {
    setSavedMessage(false);
    setErrorMessage(false);
    const saved = await put("/api/me", {
      ...data,
      isAcceptingIntroductions: formValues.isAcceptingIntroductions,
    });
    if (response.ok) {
      setSavedMessage(true);
    } else {
      setErrorMessage(true);
    }
  };

  useEffect(() => {
    async function loadData() {
      const loaded = await get("/api/me");
      setFormValues(loaded);
      // we need it so errors are handled on registered form fields
      reset(loaded);
    }
    loadData();
  }, [reset]);

  const changeCommission = (dropdown) => {
    setFormValues({ ...formValues, commissionType: dropdown.target.value });
  };

  useEffect(() => {
    setLoaderVisible(loading);
  }, [loading]);

  return (
    <>
      <DashboardLayout
        title="My Profile"
        loading={loading}
        className="max-w-2xl"
      >
        <form method="post" onSubmit={handleSubmit(onSubmit)}>
          <div className="user-form ">
            <div className="md:grid md:grid-cols-3 md:gap-6">
              {/* right panel */}
              <div className="p-4 mt-5 md:mt-0 md:col-span-3">
                {/* error message */}
                {errorMessage && (
                  <div className="relative bg-red-100">
                    <div className="px-3 py-3 mx-auto max-w-7xl sm:px-6 lg:px-8">
                      <div className="pr-16 sm:text-center sm:px-16">
                        <p className="font-medium text-red-400">
                          <span>
                            Uh, oh! A problem occurred during saving your data!
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                {/* end of error message */}
                {/* ok message */}
                {savedMessage && (
                  <div className="relative bg-green-800">
                    <div className="px-3 py-3 mx-auto max-w-7xl sm:px-6 lg:px-8">
                      <div className="pr-16 sm:text-center sm:px-16">
                        <p className="font-medium text-white">
                          <span>
                            Your profile has been changed successfully
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                {/* end of ok message */}

                <div>
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    Personal Information
                  </h3>
                  <p className="max-w-2xl mt-1 text-sm text-gray-500">
                    Your contact details are only visible to your contacts.
                  </p>
                </div>

                {/* first name field starts */}
                <div className="my-2">
                  <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start">
                    <label
                      htmlFor="firstName"
                      className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                    >
                      First name:
                    </label>
                    <div className="mt-1 sm:mt-0 sm:col-span-2">
                      <div className="flex max-w-lg rounded-md shadow-sm">
                        <input
                          type="text"
                          defaultValue={formValues.firstName}
                          {...register("firstName", {
                            required: true,
                            maxLength: 127,
                          })}
                          className="flex-1 block w-full min-w-0 border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        />
                      </div>
                      {errors.firstName?.type === "required" && (
                        <small className="text-red-900">
                          This field is required
                        </small>
                      )}
                    </div>
                  </div>
                </div>
                {/* first name field ends here */}

                {/* last name field starts */}
                <div className="my-2">
                  <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start">
                    <label
                      htmlFor="lastName"
                      className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                    >
                      Last name:
                    </label>
                    <div className="mt-1 sm:mt-0 sm:col-span-2">
                      <div className="flex max-w-lg rounded-md shadow-sm">
                        <input
                          type="text"
                          defaultValue={formValues.lastName}
                          {...register("lastName", {
                            required: true,
                            maxLength: 127,
                          })}
                          className="flex-1 block w-full min-w-0 border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        />
                      </div>
                      {errors.lastName?.type === "required" && (
                        <small className="text-red-900">
                          This field is required
                        </small>
                      )}
                    </div>
                  </div>
                </div>
                {/* last name field ends here */}

                {/* email field starts */}
                <div className="my-2">
                  <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start">
                    <label
                      htmlFor="contactEmail"
                      className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                    >
                      Contact email:
                    </label>
                    <div className="mt-1 sm:mt-0 sm:col-span-2">
                      <div className="flex max-w-lg rounded-md shadow-sm">
                        <input
                          type="text"
                          defaultValue={formValues.contactPhone}
                          {...register("contactEmail", {
                            required: false,
                            pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          })}
                          className="flex-1 block w-full min-w-0 border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        />
                      </div>
                      {errors.contactEmail?.type === "required" && (
                        <small className="text-red-900">
                          This field is required
                        </small>
                      )}
                      {errors.contactEmail?.type === "pattern" && (
                        <small className="text-red-900">
                          The email is invalid
                        </small>
                      )}
                    </div>
                  </div>
                </div>
                {/* email field ends here */}

                {/* phone field starts */}
                <div className="my-2">
                  <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start">
                    <label
                      htmlFor="contactPhone"
                      className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                    >
                      Contact phone:
                    </label>
                    <div className="mt-1 sm:mt-0 sm:col-span-2">
                      <div className="flex max-w-lg rounded-md shadow-sm">
                        <input
                          type="text"
                          defaultValue={formValues.contactPhone}
                          {...register("contactPhone", {
                            required: false,
                          })}
                          className="flex-1 block w-full min-w-0 border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        />
                      </div>
                      {errors.contactPhone?.type === "required" && (
                        <small className="text-red-900">
                          This field is required
                        </small>
                      )}
                      {errors.contactPhone?.type === "pattern" && (
                        <small className="text-red-900">
                          The phone is invalid
                        </small>
                      )}
                    </div>
                  </div>
                </div>
                {/* phone field ends here */}

                <div className="mt-8">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    Business Information
                  </h3>
                  <p className="max-w-2xl mt-1 text-sm text-gray-500">
                    These information are public and visible to all guru members
                    searching for business.
                  </p>
                </div>

                {/* business name field starts */}
                <div className="my-2">
                  <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start">
                    <label
                      htmlFor="businessName"
                      className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                    >
                      Business name:
                    </label>
                    <div className="mt-1 sm:mt-0 sm:col-span-2">
                      <div className="flex max-w-lg rounded-md shadow-sm">
                        <input
                          type="text"
                          defaultValue={formValues.businessName}
                          {...register("businessName", {
                            required: formValues.isAcceptingIntroductions,
                            maxLength: 255,
                          })}
                          className="flex-1 block w-full min-w-0 border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        />
                      </div>
                      {errors.businessName?.type === "required" && (
                        <small className="text-red-900">
                          This field is required
                        </small>
                      )}
                    </div>
                  </div>
                </div>
                {/* business name field ends here */}

                {/* business category field starts */}
                <div className="my-2">
                  <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start">
                    <label
                      htmlFor="businessCategory"
                      className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                    >
                      Business category:
                    </label>
                    <div className="mt-1 sm:mt-0 sm:col-span-2">
                      <div className="rounded-md shadow-sm">
                        <input
                          type="text"
                          defaultValue={formValues.businessCategory}
                          {...register("businessCategory", {
                            required: formValues.isAcceptingIntroductions,
                            maxLength: 255,
                          })}
                          className="flex-1 block w-full min-w-0 border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        />
                        {errors.businessCategory?.type === "required" && (
                          <small className="text-red-900">
                            This field is required
                          </small>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                {/* business category field ends here */}

                {/* address line 1 starts */}
                <div className="my-2">
                  <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start">
                    <label
                      htmlFor="address1"
                      className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                    >
                      Address (line 1):
                    </label>
                    <div className="mt-1 sm:mt-0 sm:col-span-2">
                      <div className="flex max-w-lg rounded-md shadow-sm">
                        <input
                          type="text"
                          defaultValue={formValues.address1}
                          {...register("address1", {
                            required: formValues.isAcceptingIntroductions,
                            maxLength: 255,
                          })}
                          className="flex-1 block w-full min-w-0 border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        />
                      </div>
                      {errors.address1?.type === "required" && (
                        <small className="text-red-900">
                          This field is required
                        </small>
                      )}
                    </div>
                  </div>
                </div>
                {/* address line 1 ends here */}

                {/* address line 2 starts */}
                <div className="my-2">
                  <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start">
                    <label
                      htmlFor="address2"
                      className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                    >
                      Address (line 2):
                    </label>
                    <div className="mt-1 sm:mt-0 sm:col-span-2">
                      <div className="flex max-w-lg rounded-md shadow-sm">
                        <input
                          type="text"
                          defaultValue={formValues.address1}
                          {...register("address2", {
                            maxLength: 255,
                          })}
                          className="flex-1 block w-full min-w-0 border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                {/* address line 2 ends here */}

                {/* ABN tax starts */}
                <div className="my-2">
                  <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start">
                    <label
                      htmlFor="abn"
                      className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                    >
                      ABN:
                    </label>
                    <div className="mt-1 sm:mt-0 sm:col-span-2">
                      <div className="flex max-w-lg rounded-md shadow-sm">
                        <input
                          type="text"
                          maxLength={11}
                          minLength={11}
                          defaultValue={formValues.abn}
                          {...register("abn", {
                            minLength: 11,
                            maxLength: 11,
                            required: false,
                          })}
                          className="flex-1 block w-full min-w-0 border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        />
                      </div>
                    </div>
                  </div>
                  {errors.abn?.type === "required" && (
                    <small className="text-red-900">
                      This field is required
                    </small>
                  )}
                  {errors.abn?.type === "minLength" && (
                    <small className="text-red-900">
                      This field should contain exaclty 11 chars
                    </small>
                  )}
                  {errors.abn?.type === "maxLength" && (
                    <small className="text-red-900">
                      This field should contain exaclty 11 chars
                    </small>
                  )}
                </div>
                {/* ABN tax ends here */}

                {/* country starts */}
                <div className="my-2">
                  <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start">
                    <label
                      htmlFor="businessCategory"
                      className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                    >
                      Country:
                    </label>
                    <div className="mt-1 sm:mt-0 sm:col-span-2">
                      <select
                        {...register("country", {
                          required: formValues.isAcceptingIntroductions,
                        })}
                        className="flex-1 block w-full min-w-0 border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 sm:text-sm"
                      >
                        <option value="">Select a country...</option>
                        {countryOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      {errors.country?.type === "required" && (
                        <small className="text-red-900">
                          This field is required
                        </small>
                      )}
                    </div>
                  </div>
                </div>
                {/* country ends here */}

                <div className="mt-8">
                  <Toggle
                    label="I would like to accept introductions"
                    value={formValues.isAcceptingIntroductions}
                    onChange={(value) =>
                      setFormValues({
                        ...formValues,
                        isAcceptingIntroductions: value,
                      })
                    }
                  />
                </div>
                <div className="mt-8">
                  {formValues.isAcceptingIntroductions && (
                    <Commission
                      type={formValues.commissionType}
                      value={commissionValue}
                      onChange={changeCommission}
                      errors={errors}
                      register={register}
                    />
                  )}
                </div>
                <div className="pt-5">
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="inline-flex justify-center px-4 py-2 ml-3 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
              {/* right panel ends here */}
            </div>
          </div>
        </form>
      </DashboardLayout>
    </>
  );
}
