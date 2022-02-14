import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";
import Link from "next/link";
import React, { useEffect, useState, version } from "react";
import { useForm } from "react-hook-form";
import useFetch, { CachePolicies } from "use-http";

import { env } from "@/lib/envConfig";
import useModal from "@/lib/useModal";
import { availableCommissions } from "@/lib/utils";

import Button from "@/components/buttons/Button";
import Commission from "@/components/Commission";
import Modal from "@/components/modals/ConfirmModal";
import Rating from "@/components/Rating";
import Table from "@/components/table/Table";
import Toggle from "@/components/toggles/toggle";

import { UserProfile } from "@/features/userProfile/constants";
import DashboardLayout from "@/layouts/DashboardLayout";

import AgreementSummary from "../agreement/AgreementSummary";
import type { Agreement } from "../agreement/constants";

// prepare TimeAgo
TimeAgo.setDefaultLocale(en.locale);
TimeAgo.addLocale(en);
const timeAgo = new TimeAgo("en-AU");

export default function Introductions() {
  const [loaderVisible, setLoaderVisible] = useState(false);
  const [data, setData] = useState([]);
  const [reload, setReload] = useState(true);
  const [showAgreementModal, setShowAgreementModal] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile>();
  const [formValues, setFormValues] = useState({
    commissionType: Object.keys(availableCommissions)[0],
    commissionPerReceivedLead: 0,
    commissionPerCompletedLead: 0,
    commissionPerReceivedLeadPercent: 0,
    isAcceptingIntroductions: false,
  });
  const commissionValue = formValues[formValues.commissionType];

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm();

  const {
    isShowing,
    toggle,
    caption,
    setCaption,
    content,
    setContent,
    acceptCaption,
    setAcceptCaption,
    cancelCaption,
    setCancelCaption,
    accept,
    setAccept,
    cancel,
    setCancel,
  } = useModal();

  const { get, post, put, response, loading, error } = useFetch();

  function handleCancelButton() {
    toggle();
  }

  function handleAcceptDoNothing() {
    window.location.href = `${env.BASE_URL}/app/introductions`;
  }

  async function handleRate(original) {
    async function handleAcceptButton() {
      const form: any = document.getElementById("rateForm");
      const rate = form?.elements[5].value;
      const comment = form?.elements[6].value;

      const rating = await post("/job/rate", {
        rate: rate,
        comment: comment,
        jobId: original._id,
      });
      window.location.href = `${env.BASE_URL}/app/introductions`;
    }

    let ratingLength = 0;
    if ("review" in original) {
      ratingLength = original.review.length;
    }
    let defaultRate = 1;
    let defaultComment = "";
    if (ratingLength > 0) {
      defaultComment = original.review[0].comment;
      defaultRate = original.review[0].rate;
    }
    toggle();
    setCaption(`Rate ${original.firstName} ${original.lastName}`);
    setAcceptCaption("Rate");
    setAccept(() => handleAcceptButton);

    const ratingContent = (
      <>
        <form id="rateForm">
          <div className="pt-4 sm:col-span-4">
            <label
              htmlFor="rate"
              className="block text-sm font-medium text-gray-700"
            >
              Your rating:
            </label>
            <div className="mt-1 rounded-md shadow-sm">
              <Rating
                initialValue={defaultRate}
                name={"rating-" + original.guru._id}
                editing
              />
            </div>
          </div>

          <div className="sm:col-span-4">
            <label
              htmlFor="comment"
              className="block text-sm font-medium text-gray-700"
            >
              Comment:
            </label>
            <div className="mt-1 rounded-md shadow-sm">
              <textarea name="comment">{defaultComment}</textarea>
            </div>
          </div>
        </form>
      </>
    );
    setContent(ratingContent);
  }

  async function handleAccept(original) {
    async function handleAcceptButton() {
      const accept = await post("/introductions/accept", {
        introId: original._id,
      });

      window.location.href = `${env.BASE_URL}/app/introductions`;
    }

    const job = await get(`/job/details?id=${original._id}`);
    if (!job) {
      return null;
    }
    const agreement: Agreement = job[0].agreement;

    setCaption("Review your agreement with guru");
    setContent(<AgreementSummary agreement={agreement} />);
    setAcceptCaption("Proceed");
    setCancelCaption("Cancel");
    setCancel(() => handleCancelButton);
    setAccept(() => handleAcceptButton);
    toggle();
    setReload(!reload);
  }

  async function handleDecline(original) {
    async function handleAcceptButton() {
      toggle();
      const decline = await post("/introductions/decline", {
        introId: original._id,
      });
      window.location.href = `${env.BASE_URL}/app/introductions`;
    }

    toggle();
    setCaption("Are you sure?");
    setContent("You are about to decline the introduction");
    setAcceptCaption("Yes, I'm sure");
    setCancelCaption("Cancel");
    setCancel(() => handleCancelButton);
    setAccept(() => handleAcceptButton);
    setReload(!reload);
  }

  async function handleFinaliseSubmit(e, jobId) {
    e.preventDefault();

    const stripePresent = await get(`/job/stripeCheck?id=${jobId}`);

    // if (!stripePresent.stripeCheck && stripePresent.mailSent) {
    //   toggle();
    //   setCaption("The Guru has not connected his account with Stripe yet");
    //   setContent(
    //     "We sent the mail to the Guru, please come back and try again in a few days."
    //   );
    //   setAccept(() => handleAcceptDoNothing);
    //   setCancel(null);
    //   setCancelCaption("OK");
    //   setAcceptCaption(null);
    //   return;
    // }
    // const isStripeActive = await get(`/job/isStripeActive?id=${jobId}`);
    // if (!isStripeActive.charges) {
    //   toggle();
    //   setCaption("The Guru has not set up his Stripe account yet");
    //   setContent(
    //     "We sent the mail to the Guru, please come back and try again in a few days."
    //   );
    //   setAccept(() => handleAcceptDoNothing);
    //   setCancel(null);
    //   setCancelCaption("OK");
    //   setAcceptCaption(null);
    //   return;
    // }

    window.location.href = `${env.BASE_URL}/app/job/${jobId}/finalize`;
  }

  async function loadData() {
    const loaded = await get(`/introductions`);
    if (response.ok) {
      setReload(false);
      setData(loaded);
    }
  }

  async function loadUser() {
    const data = await get(`/me`);
    if (response.ok) {
      setReload(false);
      setUserProfile(data);
    }
  }

  useEffect(() => {
    if (reload) {
      loadData();
    }
  }, [reload]);

  useEffect(() => {
    loadUser();
  }, []);

  useEffect(() => {
    setLoaderVisible(loading);
  }, [loading]);

  const columns = [
    {
      Header: "introduced",
      accessor: "introduced",
      Cell: ({ row: { original: data } }) => (
        <>
          <div className="cell-name">{data.customer.name}</div>
          <div className="cell-email">
            <a
              className="text-xs text-blue-500"
              href={`tel:${data.customer.email}`}
            >
              {data.customer.email}
            </a>
          </div>
          <div className="cell-phone">
            <a
              className="text-xs text-blue-500"
              href={`tel:${data.customer.phone}`}
            >
              {data.customer.phone}
            </a>
          </div>
        </>
      ),
    },
    {
      Header: "to",
      accessor: "to",
      Cell: ({ row: { original: data } }) => (
        <>
          <div className="cell-name">
            {data.position === "guru" ? data.business.name : "Me"}
          </div>
          {data.position === "guru" && (
            <div className="text-xs cell-business">
              <div>
                {data.business.company}{" "}
                {data.business.businessCategory &&
                  `| ${data.business.businessCategory}`}
              </div>
              <div>
                <a
                  className="text-xs text-blue-500"
                  href={`tel:${data.business.phone}`}
                >
                  {data.business.phone}
                </a>
              </div>
              <div>
                <a
                  className="text-xs text-blue-500"
                  href={`tel:${data.business.email}`}
                >
                  {data.business.email}
                </a>
              </div>
            </div>
          )}
        </>
      ),
    },
    {
      Header: "by",
      accessor: "by",
      Cell: ({ row: { original: data } }) => (
        <>
          <div className="cell-name">
            {data.position === "guru" ? "Me" : data.guru.name}
          </div>
          {data.position === "business" && (
            <div className="text-xs cell-business">
              <div>
                <a
                  className="text-xs text-blue-500"
                  href={`tel:${data.guru.contactPhone}`}
                >
                  {data.guru.contactPhone}
                </a>
              </div>
              <div>
                <a
                  className="text-xs text-blue-500"
                  href={`tel:${data.guru.contactEmail}`}
                >
                  {data.guru.contactEmail}
                </a>
              </div>
            </div>
          )}
        </>
      ),
    },
    {
      Header: "date",
      accessor: "date",
      Cell: ({ row: { original } }) => (
        <>
          {original.date === undefined
            ? ""
            : timeAgo.format(new Date(original.date))}
        </>
      ),
    },
    {
      Header: "status",
      accessor: "status",
      Cell: ({ row: { original } }) => (
        <>
          {original.status === "waiting for Guru" &&
          original.position === "guru"
            ? "waiting for business to accept"
            : original.status}
        </>
      ),
    },
    {
      Header: "commission",
      accessor: "commissionEarned",
      Cell: ({ row: { original: data } }) => (
        <>
          <div>
            {data.position === "business" && (
              <span className="text-yellow-500">
                {data.sumCommission.toLocaleString("en-AU", {
                  style: "currency",
                  currency: data.agreement.commissionCurrency || "AUD",
                })}
              </span>
            )}
            {data.position === "guru" && (
              <span className="text-green-500">
                received:{" "}
                {data.sumCommission.toLocaleString("en-AU", {
                  style: "currency",
                  currency: data.agreement.commissionCurrency || "AUD",
                })}
              </span>
            )}
          </div>
        </>
      ),
    },
    {
      Header: "",
      accessor: "_id",
      Cell: ({ row: { original: data } }) => {
        const finishJobButton = (
          <div>
            <Link passHref href={`/app/job/${data._id}/finalize`}>
              <a className="bg-green-500 text-white py-2 px-4 rounded font-normal hover:text-opacity-75 animated-underline border border-gray-600 focus:outline-none focus-visible:text-white">
                Finish job
              </a>
            </Link>
          </div>
        );

        const acceptDeclineButtons = (
          <>
            <div className="mb-2">
              <Button
                variants="primary"
                className="text-xs mr-2"
                onClick={(e) => handleAccept(data)}
              >
                Accept
              </Button>
            </div>
            <div>
              <Button
                variants="secondary"
                className="text-xs"
                onClick={(e) => handleDecline(data)}
              >
                Decline
              </Button>
            </div>
          </>
        );

        const rateButton = (
          <>
            <div>
              <Button
                variants="primary"
                className="text-xs"
                onClick={(e) => handleRate(data)}
              >
                Rate
              </Button>
            </div>
          </>
        );

        let initialRating;
        let ratingLength = 0;
        if ("review" in data) {
          ratingLength = data.review.length;
          initialRating = ratingLength > 0 ? data.review[0].rate : 1;
        }

        const rateStars = data.position === "guru" && (
          <Rating
            initialValue={initialRating}
            // editing={false}
            onStarClick={(e) => handleRate(data)}
          />
        );

        return (
          <div>
            {data.status === "pending" ? acceptDeclineButtons : null}
            {data.status === "accepted" && data.position === "business"
              ? finishJobButton
              : null}
            {data.position === "guru" && ratingLength === 0 ? rateButton : null}
            {data.position === "guru" && ratingLength > 0 ? rateStars : null}
          </div>
        );
      },
    },
  ];

  const list = data || [];
  const acceptIntroductions = async (value) => {
    // user didn't set the terms
    if (value) {
      return setShowAgreementModal(true);
    }
    saveCommission(userProfile);
  };

  const changeCommission = (dropdown) => {
    setFormValues({ ...formValues, commissionType: dropdown.target.value });
  };

  const saveCommission = async (data) => {
    const updateData = {
      ...formValues,
      ...data,
      isAcceptingIntroductions: !userProfile?.isAcceptingIntroductions,
    };

    await put("/me", updateData);

    if (response.ok) {
      if (userProfile) {
        setUserProfile({
          ...response.data,
        });
      }
    }
    setShowAgreementModal(false);
  };
  return (
    <DashboardLayout
      title="Introductions"
      loading={loading}
      actions={
        <div className="mt-3 flex sm:mt-0 sm:ml-4">
          <Toggle
            label="Accept introductions"
            value={Boolean(userProfile?.isAcceptingIntroductions)}
            onChange={acceptIntroductions}
            description={
              userProfile?.isAcceptingIntroductions
                ? "your profile is searchable"
                : "your profile is hidden"
            }
          />
          <Modal
            isShowing={showAgreementModal}
            acceptCaption="Save"
            cancelCaption="Cancel"
            onAccept={saveCommission}
            onCancel={() => setShowAgreementModal(false)}
            form="commission"
            content={
              <form
                id="commission"
                className="text-left"
                onSubmit={handleSubmit((data) => saveCommission(data))}
              >
                <Commission
                  type={formValues.commissionType}
                  value={commissionValue}
                  onChange={changeCommission}
                  errors={errors}
                  register={register}
                />
              </form>
            }
          />
          <Link href={"/"}>
            <a className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
              New Introduction
            </a>
          </Link>
        </div>
      }
    >
      <Table columns={columns} data={list} loading={loading} />
      <div>
        <Modal
          isShowing={isShowing}
          acceptCaption={acceptCaption}
          cancelCaption={cancelCaption}
          content={content}
          caption={caption}
          onAccept={accept}
          onCancel={toggle}
        />
      </div>
    </DashboardLayout>
  );
}
