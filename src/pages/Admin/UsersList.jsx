import { useDispatch, useSelector } from "react-redux";

import { useGetUsersQuery } from "../../store/apiSlices/usersApiSlice";

import { setPage } from "../../store/stateSlices/usersStateSlice";

const UsersList = () => {
  const dispatch = useDispatch();
  const { page, limit } = useSelector((state) => state.users);
  const { data, error, isLoading } = useGetUsersQuery(
    { page, limit },
    {
      refetchOnMountOrArgChange: false,
    }
  );

  if (isLoading) return <p>Loading users...</p>;
  if (error) return <p>Error fetching users.</p>;

  return (
    <div>
      <h2>Users List</h2>
      <ul>
        {data?.users?.map((user) => (
          <li key={user.id}>
            {user.name} - {user.email}
          </li>
        ))}
      </ul>

      <div>
        <button
          onClick={() => dispatch(setPage(page - 1))}
          disabled={page === 1}
        >
          Previous
        </button>
        <span> Page {page} </span>
        <button
          onClick={() => dispatch(setPage(page + 1))}
          disabled={data?.users.length < limit}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default UsersList;
