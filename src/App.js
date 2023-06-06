import { useCallback, useDeferredValue, useMemo, useState } from 'react';
import './App.css';


const USERS = [
  {id: 1, name: 'John Doe', email: 'john.doe@example.com', isActive: false },
  {id: 2, name: 'Mary Appleseed', email: 'mary.a@example.com ', isActive: false },
  {id: 3, name: 'John Wick', email: 'john.w@example.com', isActive: false },
  {id: 4, name: 'Kisa Mao', email: 'kisa.m@example.com', isActive: false },
  {id: 5, name: 'Korgi Gav', email: 'korgi.g@example.com', isActive: false },
];

const useChangeUser = (setUsers, cb) => useCallback(
  (id, ...args) => setUsers(
    users => users.map(
      user => user.id === id ? cb(user, ...args) : user
    )
  ),
  [setUsers, cb]
);

const changeUserActive = user => ({ ...user, isActive: !user.isActive });
const changeUserField = (user, name, value) => ({ ...user, [name]: value });
const createNewUser = users => [
  ...users,
  { id: users.length + 1, name: '', email: '', isActive: false }
];

const useUsers = () => {
  const [users, setUsers] = useState(USERS);
  return {
    users,
    setUserActive: useChangeUser(setUsers, changeUserActive),
    setUserField: useChangeUser(setUsers, changeUserField),
    addUser: () => setUsers(createNewUser),
  };
};

const useSearch = users => {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  const filteredUsers = useMemo(() => {
    if (!deferredQuery) return users;
    return users.filter(user => user.name.includes(deferredQuery) || user.email.includes(deferredQuery))
  }, [users, deferredQuery]);
  return {
    filteredUsers,
    query,
    setQuery,
  };
};

const useSort = users => {
  const [colDirection, setColDirection] = useState(['id', 1]);
  const sortedUsers = useMemo(() => {
    return [...users].sort((a, b) => {
      const [name, dir] = colDirection;
      if (a[name] > b[name]) return dir;
      if (a[name] < b[name]) return -dir;
      return 0;
    });
  }, [users, colDirection]);
  return {
    sortedUsers,
    changeDirection: name => setColDirection(([, dir]) => [name, -dir]),
  };
};

const App = () => {
  const {
    users,
    setUserActive,
    setUserField,
    addUser,
  } = useUsers();

  const {
    filteredUsers,
    query,
    setQuery,
  } = useSearch(users);

  const {
    sortedUsers,
    changeDirection,
  } = useSort(filteredUsers);

  return (
    <div className="users-page">
      <div className="search-user">
        <input
          placeholder="Имя или Email..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>
      <table className="users-table">
        <thead>
          <tr>
            <th onClick={() => changeDirection('id')}>ID</th>
            <th onClick={() => changeDirection('name')}>Имя</th>
            <th onClick={() => changeDirection('email')}>Email</th>
            <th onClick={() => changeDirection('isActive')}>Active</th>
          </tr>
        </thead>
        <tbody>
          {sortedUsers.map(({ id, name, email, isActive }) => (
            <tr key={id}>
              <td className="fixed-centred-column">
                {id}
              </td>
              <td>
                <input
                  name="name"
                  defaultValue={name}
                  onBlur={(event) => setUserField(id, 'name', event.target.value)}
                />
              </td>
              <td>
                <input
                  name="email"
                  defaultValue={email}
                  onBlur={(event) => setUserField(id, 'email', event.target.value)}
                />
              </td>
              <td className="fixed-centred-column">
                <label className="checkbox-container">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={() => setUserActive(id)}
                  />
                  <span className="checkbox-mark" />
                </label>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="buttonContainer">
        <button className="button" onClick={addUser}>Добавить пользователя</button>
      </div>
    </div>
  );
};

export default App;