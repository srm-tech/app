import React, { useEffect, useState } from "react";
import StarRatingComponent from "react-star-rating-component";
import useFetch, { CachePolicies } from "use-http";

import Button from "@/components/buttons/Button";
import Link from "@/components/buttons/Link";
import DashboardLayout from "@/layouts/DashboardLayout";
import Table from "@/components/table/Table";
import { env } from "@/lib/envConfig";

export default function MyContacts() {
  const [loaderVisible, setLoaderVisible] = useState(false);
  const [data, setData] = useState([]);
  const [reload, setReload] = useState(true);

  const { get, post, response, loading, error } = useFetch();

  async function loadData() {
    const loaded = await get("/myContacts");
    if (response.ok) {
      setReload(false);
      setData(loaded);
    }
  }

  useEffect(() => {
    if (reload) {
      loadData();
    }
  }, [reload]);

  async function handleAccept(e, invitationId) {
    const accept = await post("/invitations/accept", {
      invitationId: invitationId,
    });
    setReload(true);
  }

  async function handleDecline(e, invitationId) {
    const decline = await post("/invitations/decline", {
      invitationId: invitationId,
    });
    setReload(true);
  }

  async function handleToggleFav(e, contactId) {
    const fav = await post("/favourites/toggle", { contactId: contactId });
    setReload(true);
  }

  async function handleRemoveFromContacts(e, contactId) {
    const remove = await post("/myContacts/remove", {
      contactId: contactId,
    });
  }

  useEffect(() => {
    setLoaderVisible(loading);
  }, [loading]);

  const columns = [
    {
      Header: "name",
      accessor: "name",
      Cell: ({ row: { original } }) => (
        <>
          <div className="cell-name">
            {original.contact.firstName} {original.contact.lastName}
          </div>
          <small>
            <div>{original.contact.businessName}</div>
            <div className="cell-email">{original.contact.email}</div>
            <div className="cell-phone">{original.contact.phone}</div>
          </small>
        </>
      ),
    },
    { Header: "business category", accessor: "contact.businessCategory" },
    {
      Header: "rating",
      accessor: "contact.rating",
      Cell: ({ value }) => (
        <StarRatingComponent
          emptyStarColor="#ccc"
          starColor="#fa0"
          value={value}
          starCount={5}
          editing={false}
        />
      ),
    },
    {
      Header: "average commission",
      accessor: "contact.avgCommissionCustomer",
      Cell: ({ row: { original } }) => (
        <>
          <div>
            <span className="text-yellow-500">
              sent:{" "}
              {original.contact.avgCommissionBusiness
                ? original.contact.avgCommissionBusiness.toFixed(2)
                : 0}{" "}
              A$
            </span>
            <br />
            <span className="text-green-500">
              received:{" "}
              {original.contact.avgCommissionCustomer
                ? original.contact.avgCommissionCustomer.toFixed(2)
                : 0}{" "}
              A$
            </span>
          </div>
        </>
      ),
    },
    {
      Header: "favourites",
      accessor: "isFavourite",
      Cell: ({ row: { original } }) => (
        <Link href="" onClick={(e) => handleToggleFav(e, original._id)}>
          {original.isFavourite ? (
            <span className="text-red-700" aria-label="remove from favourites">
              &#x2665;
            </span>
          ) : (
            <span className="text-red-100" aria-label="add to favourites">
              &#x2665;
            </span>
          )}
        </Link>
      ),
    },
    // { Header: 'status', accessor: 'status' },
    {
      Header: "actions",
      accessor: "_id",
      Cell: ({ row: { original } }) => {
        const id = original._id;
        const acceptDeclineButtons = (
          <>
            <div>
              <Button
                variants="primary"
                className="text-xs"
                onClick={(e) => handleAccept(e, id)}
              >
                Accept
              </Button>
              <Button
                variants="secondary"
                className="text-xs"
                onClick={(e) => handleDecline(e, id)}
              >
                Decline
              </Button>
            </div>
          </>
        );

        return (
          <>{original.status === "pending" ? acceptDeclineButtons : <></>}</>
        );
      },
    },
  ];
  return (
    <DashboardLayout title="My Contacts" loading={loading}>
      <Table data={data} columns={columns} loading={loading} />
    </DashboardLayout>
  );
}
