import React from "react";
import UsersList from "./../components/UsersList";

function Users() {
  const USERS = [
    {
      id: 1,
      name: "Jim",
      image: "https://picsum.photos/200",
      places: 3
    },
    {
      id: 2,
      name: "Bill",
      image: "https://picsum.photos/200",
      places: 1
    }
  ];
  return <UsersList items={USERS} />;
}

export default Users;
