import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";

export default function UserList() {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      const querySnapshot = await getDocs(collection(db, "users"));
      const data: any[] = [];
      querySnapshot.forEach((doc) => data.push({ id: doc.id, ...doc.data() }));
      setUsers(data);
    }

    fetchData();
  }, []);

  return (
    <div>
      <h1>Usuarios</h1>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            <strong>{user.name}</strong> - {user.email} - {user.phone} - {user.address}
          </li>
        ))}
      </ul>
    </div>
  );
}
