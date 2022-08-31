import React from 'react';

import Collection from './Collection';
import './index.scss';

const categories = [
  { "name": "Все" },
  { "name": "Море" },
  { "name": "Горы" },
  { "name": "Архитектура" },
  { "name": "Города" }
];

function App() {

  const [categoryId, setCategoryId] = React.useState(0);
  const [searchValue, setSearchValue] = React.useState('');
  const [page, setPage] = React.useState(1);
  const [isLoading, setIsLoading] = React.useState(true);
  const [collection, serCollection] = React.useState([]);

  React.useEffect(() => {
    setIsLoading(true);

    const category = categoryId ? `category=${categoryId}` : '';

    fetch(`https://630f21ef498924524a867edb.mockapi.io/photo_collections?page=${page}&limit=3&${category}`) // it's really a heavy expression
      .then(res => res.json())
      .then(json => {
        serCollection(json);
      })
      .catch(err => {
        console.warn(err);
        alert(`Ошибка при получении данных ${err.message}`);
      })
      .finally(() => setIsLoading(false));
  }, [categoryId, page]);

  return (
    <div className="App">
      <h1>Моя коллекция фотографий</h1>
      <div className="top">
        <ul className="tags">
          {
            categories.map((obj, i) => 
              <li 
                onClick={() => setCategoryId(i)}
                className={categoryId === i ? 'active' : ''}
                key={obj.name}>{obj.name}
              </li>)
          }
        </ul>
        <input
           className="search-input"
           placeholder="Поиск по названию"
           value={searchValue}
           onChange={e => setSearchValue(e.target.value)} />
      </div>
      <div className="content">
        {isLoading ? (<h2>Идет загрузка...</h2>) : (
          collection.filter((obj) => obj.name.toLowerCase().includes(searchValue.toLowerCase())) // filtering to search by name
          .map((obj, i) => (
            <Collection
              name={obj.name}
              images={obj.photos}
              key={i}
            />
          ))
        )}
      </div>
      <ul className="pagination">
            {
              [...Array(5)].map((_, i) => ( // backend simulaions
                <li  
                  className={page === i + 1 ? 'active' : ''}
                  onClick={() => setPage(i + 1)}
                  key={i}>{i + 1}</li>
              ))
            }
      </ul>
    </div>
  );
}

export default App;
