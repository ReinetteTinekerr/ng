'use client'
import Image from 'next/image'

import { Montserrat, Permanent_Marker } from 'next/font/google'
import { useState, useEffect } from 'react'
import { useQuery } from 'react-query';

// const fetcher = (...args:any) => fetch(...args).then(res => res.json())
// export const revalidate = 30;


const montserrat = Montserrat({
  weight: '700',
  subsets: ['latin'],
  style: 'normal',
})

const permanentMarker = Permanent_Marker({ weight: '400', subsets: ['latin'] });

interface IAccountInfo {
  id: number,
  price: number,
  games: string[],
}

const randomSeededPokemon = (seed: number) => {
  const x = Math.sin(seed) * 10000;
  return Math.round((x - Math.floor(x)) * 500)
}

export default function Home() {
  const { isLoading, error, data, } = useQuery('accounts', () =>
    fetch('/api/hello', { cache: 'no-store' }).then(res =>
      res.json()
    ), {
    onSuccess(data) {
      const cleanedData: IAccountInfo[] = getCleaData(data);
      const ids = cleanedData.map((acc) => acc.id);
      setAccountsIds(ids)

      setNintendoGames(cleanedData)
      setSearchAccouts(cleanedData)
    },
  }
  )



  const [search, setSearch] = useState('');
  const [accountsIds, setAccountsIds] = useState<number[]>([]);
  const [pokemons, setPokemons] = useState<any>({});
  const [nintendoGames, setNintendoGames] = useState<IAccountInfo[] | []>([]);
  const [searchAccounts, setSearchAccouts] = useState<IAccountInfo[] | []>([]);
  const [itemsToDisplay, setItemsToDisplay] = useState<IAccountInfo[] | []>([]);
  const [ascending, setAscending] = useState(true);

  const itemsPerPage = 20;
  const [currentPage, setCurrentPage] = useState(1);
  const [totalNumberOfPages, setTotalNumberOfPages] = useState(Math.ceil(searchAccounts.length / itemsPerPage));


  useEffect(() => {
    async function fetchPokemons() {
      const pokemonsObj: any = {}
      for (let index = 0; index < accountsIds.length; index++) {
        const id = accountsIds[index];
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomSeededPokemon(id)}`);
        const data = await res.json();
        const pokemon = { 'sprite': data.sprites.other.dream_world.front_default, 'name': data.name };
        // pokemonsList.push(pokemon);
        pokemonsObj[id] = pokemon;
      }
      setPokemons(pokemonsObj);
    }
    fetchPokemons();
  }, [accountsIds]);

  useEffect(() => {

    setTotalNumberOfPages(Math.ceil(searchAccounts.length / itemsPerPage));
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage - 1, searchAccounts.length - 1);
    const itemsLeft = searchAccounts.slice(startIndex, endIndex + 1);
    setItemsToDisplay(itemsLeft);

  }, [currentPage, searchAccounts])



  // useEffect(() => {
  //   async function getDocumentContent() {
  //     const res = await fetch('/api/hello', { next: { revalidate: 0 } });
  //     const data: string = await res.json();
  //     // console.log('wew');


  //     const cleanedData: IAccountInfo[] = getCleaData(data);
  //     // console.log(cleanedData);
  //     setNintendoGames(cleanedData)
  //     setSearchAccouts(cleanedData)
  //   }

  //   getDocumentContent()
  // }, [])

  const getCleaData = (data: string) => {
    const splitData = data.trim().split(/\n\s*\n/);
    const dataWithoutTransactions = splitData.map((acc) => {
      return acc.replace(/-*\s*transactions\s*-*\n/g, "").replace(/-*\s*end transactions\s*-*/g, "").trim()
    })

    const accounts = []
    for (const acc of dataWithoutTransactions) {
      const splitData = acc.split('\n');

      try {

        const id = splitData[0].match(/\d+/g)
        const price = splitData[1].match(/\d+/g)
        const games = splitData.slice(2);
        games.sort();
        // const sortedGames = games.sort((a,b) => a - b)

        if (id !== null && price !== null && games !== null) {
          accounts.push({ id: Number.parseInt(id[0]), price: Number.parseInt(price[0]), games: games })
        }
      } catch (error) {
        return accounts;

      }
    }
    return accounts;

  }

  if (isLoading) {
    return <main className='flex justify-center items-center text-5xl h-screen'>
      <Image src={'/mario.gif'} width={280} height={280} alt='Loading...' />

      {/* <div role="status">
        <svg aria-hidden="true" className="inline w-10 h-10 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
          <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
        </svg>
        <span className="sr-only">Loading...</span>
      </div> */}
    </main>

  }
  if (error) {
    console.log(error);
    return <>ERROR</>
  }


  if (data) {
    //   // console.log('data', data.length);
    // console.log(data);

  }



  const searchResults = (query: string) => {
    setSearch(query);

    const matches: any = [];

    if (query.trim().length <= 0) {

      setSearchAccouts(nintendoGames);
      return;
    }

    for (let i = 0; i < nintendoGames.length; i++) {
      // for (const game of item.games) {
      // console.log(nintendoGames[i].id);


      const queries = query.toLowerCase().trim().split(" ");

      const hasCommonString = queries.some(str1 =>
        nintendoGames[i].games.some((str2: any) => str2.toLowerCase().includes(str1.toLowerCase()))
      );
      if (hasCommonString || queries.includes(nintendoGames[i].id.toString())) {
        matches.push(nintendoGames[i]);
      }
      // }
    }
    setSearchAccouts(matches)
    setCurrentPage(1);

  }
  const onClickSort = () => {
    setAscending(!ascending);
    setSearchAccouts([...searchAccounts].reverse())
  }
  const onSortValues = (sortBy: string) => {
    switch (sortBy) {
      case 'id':
        if (ascending) {

          setSearchAccouts([...searchAccounts].sort((a, b) => a.id - b.id));
        } else {

          setSearchAccouts([...searchAccounts].sort((a, b) => b.id - a.id));
        }
        break;
      case 'price':
        if (ascending) {
          const sorted = [...searchAccounts].sort((a, b) => a.price - b.price)
          setSearchAccouts(sorted);
        } else {
          const sorted = [...searchAccounts].sort((a, b) => b.price - a.price)
          setSearchAccouts(sorted);
        }
        break;
      case 'date':
        setSearchAccouts([...searchAccounts].sort((a, b) => a.id - b.id));
        break;
      case 'games':
        if (ascending) {
          const sorted = [...searchAccounts].sort((a, b) => a.games.length - b.games.length)
          setSearchAccouts(sorted);
        } else {
          const sorted = [...searchAccounts].sort((a, b) => b.games.length - a.games.length)
          setSearchAccouts(sorted);
        }
        break;
      default:
        setSearchAccouts([...searchAccounts].sort((a, b) => a.id - b.id));
    }

  }
  return (
    <main className=''>
      <div className="flex items-center justify-between pt-5 pb-5 px-5">
        <div className="relative w-64 md:w-96">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg aria-hidden="true" className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path></svg>
          </div>
          <label htmlFor="simple-search" className="sr-only">Search</label>
          <input value={search} onChange={(q) => searchResults(q.target.value)} type="text" id="simple-search" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  " placeholder="Search" />
        </div>
        <div className='flex flex-row items-center'>
          {
            <button onClick={onClickSort} className='mx-2 '>
              {ascending ? <Image src={"/arrow-up.png"} width={30} height={30} alt="ascending" /> :
                <Image src={"/arrow-down.png"} width={30} height={30} alt="ascending" />}
            </button>
          }

          <div className="relative w-28 lg:w-64">
            {/* <label htmlFor="countries" className="block text-sm font-medium text-gray-900 dark:text-white">Select an option</label> */}
            <select defaultValue={"id"} onChange={(e) => onSortValues(e.target.value)} id="countries" className=" bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ">
              <option value="id">ID</option>
              <option value="price">Price</option>
              <option value="date">Date</option>
              <option value="games">Games</option>
            </select>
          </div>
        </div>
      </div>
      <hr />
      <div className='mb-2'></div>
      <section className="">
        <div className={`text-center text-3xl md:text-4xl text-rose-800 ${permanentMarker.className}`}>Available Accounts</div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 m-8">
          {itemsToDisplay.map((acc: any) => {
            const pokemon = pokemons[acc.id];
            return <Card key={acc.id} account={acc} pokemon={pokemon} />
          })}
        </div>
        <Pagination totalPages={totalNumberOfPages} totalItems={searchAccounts.length} currentPage={currentPage} onSetCurrentPage={setCurrentPage} />
      </section>
    </main >
  )
}


function Card({ account, pokemon }: any) {
  let sprite = '';
  if (pokemon !== undefined && pokemon.sprite !== undefined) {
    sprite = pokemon.sprite;
    // sprite = `bg-[url('https://${sprite}')]`
  }


  // const regex = /-\?\[?\d+(?:\.\d)?\sUSD\]?/g;
  const regex = /-?\s?\$?\[?\d+(?:\.\d{1,2})?\s?USD\]?/g;
  const regex2 = /\-?\s\$\d+(?:\.\d{1,2})?/g;
  const span = (account.games.length > 6) ? 'col-span-2' : ''
  return <div style={{ backgroundImage: `url(${sprite})` }} className={`bg-no-repeat bg-center bg-contain hover:scale-[1.05] hover:border-rose-500 transition duration-300 p-1 bg-slate-100 border ${span} md:col-span-1 border-blue-300 rounded-lg shadow md:col-span-1`}>
    <div className='flex justify-between bg-cyan-900/95  p-3 rounded-md'>
      <div>
        <div className='bg-rose-500 text-white text-sm lg:text-lg font-medium md:px-2.5 h-6 lg:h-8 rounded-sm pb-1 px-1'>#{account.id}</div>
        <a
          className="transititext-primary text-primary transition duration-150 ease-in-out hover:text-primary-600 focus:text-primary-600 active:text-primary-700 dark:text-primary-400 dark:hover:text-primary-500 dark:focus:text-primary-500 dark:active:text-primary-600"
          data-te-toggle="tooltip"
          title="Copy"
        >

          <button
            className='relative top-2'
            onClick={() => navigator.clipboard.writeText(`#${account.id}\nPokemonCode: ${pokemon.name.toUpperCase()}\nGames:\n${account.games.join('\n')}
            `)}>
            <svg className='bg-slate-300 border hover:bg-slate-400 hover:scale-[1.05] rounded-md' fill="" viewBox="0 0 15 15" height="1.5em" width="2em" >
              <path
                fill="currentColor"
                fillRule="evenodd"
                d="M1 9.5A1.5 1.5 0 002.5 11H4v-1H2.5a.5.5 0 01-.5-.5v-7a.5.5 0 01.5-.5h7a.5.5 0 01.5.5V4H5.5A1.5 1.5 0 004 5.5v7A1.5 1.5 0 005.5 14h7a1.5 1.5 0 001.5-1.5v-7A1.5 1.5 0 0012.5 4H11V2.5A1.5 1.5 0 009.5 1h-7A1.5 1.5 0 001 2.5v7zm4-4a.5.5 0 01.5-.5h7a.5.5 0 01.5.5v7a.5.5 0 01-.5.5h-7a.5.5 0 01-.5-.5v-7z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </a >
      </div>
      <div className='font-bold text-white'>
        <div>Price: {account.price}</div>
        <div>Games: {account.games.length}</div>
      </div>
    </div>
    <div className='hover:bg-zinc-700/95 bg-zinc-700/80 rounded-md mt-1'>

      <div className='p-2 text-sm text-white md:text-base'>
        <ul>
          {account.games.map((game: any, index: number) => {

            const outputString1 = game.replace(regex, "");
            const outputString2 = outputString1.replace(regex2, "");
            return <li key={index}>{outputString2}
              <hr />
            </li>

          })}
        </ul>

      </div>
    </div>
  </div>
}

function Pagination({ totalPages, currentPage, onSetCurrentPage, totalItems }: any) {
  return <div>

    <nav aria-label="Page navigation example">
      <ul className="flex items-center justify-center -space-x-px mb-5">
        <li>
          <button disabled={currentPage === 1} onClick={() => {
            onSetCurrentPage(1);
          }} className="disabled:bg-gray-50 block px-3 py-2 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 ">
            {/* <span className="sr-only">Previous</span>
            <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd"></path></svg> */}
            First
          </button>
        </li>
        <li>
          <button disabled={currentPage === 1} onClick={() => {
            onSetCurrentPage(Math.max(1, currentPage - 1));
          }} className="disabled:bg-gray-50 block px-3 py-2 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 ">
            <span className="sr-only">Previous</span>
            <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
          </button>
        </li>
        <li>
          <a href="#" className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 ">{currentPage} / {totalPages} | ({totalItems})</a>
        </li>
        <li>
          <button disabled={currentPage === totalPages} onClick={() => {
            onSetCurrentPage(Math.min(currentPage + 1, totalPages));

          }} className="disabled:bg-gray-50 block px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300  hover:bg-gray-100 ">
            <span className="sr-only">Next</span>
            <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path></svg>
          </button>
        </li>
        <li>
          <button disabled={currentPage === totalPages} onClick={() => {
            onSetCurrentPage(totalPages);

          }} className="disabled:bg-gray-50 block px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 ">
            Last
          </button>
        </li>
      </ul>
    </nav>

  </div>
}