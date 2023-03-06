'use client'
import Image from 'next/image'

import { Montserrat } from 'next/font/google'
import { useState, useEffect } from 'react'
import { useQuery, QueryClient, QueryClientProvider } from 'react-query'

const montserrat = Montserrat({
  weight: '700',
  subsets: ['latin'],
  style: 'normal',
})

interface IAccountInfo {
  id: number,
  price: number,
  games: string[],
}



export default function Home() {
  const { isLoading, error, data, } = useQuery('accounts', () =>
    fetch('/api/hello', { cache: 'no-store' }).then(res =>
      res.json()
    ), {
    onSuccess(data) {
      const cleanedData: IAccountInfo[] = getCleaData(data);

      setNintendoGames(cleanedData)
      setSearchAccouts(cleanedData)
    },
  }
  )

  const [search, setSearch] = useState('');
  const [nintendoGames, setNintendoGames] = useState<IAccountInfo[] | []>([]);
  const [searchAccounts, setSearchAccouts] = useState<IAccountInfo[] | []>([]);
  const [itemsToDisplay, setItemsToDisplay] = useState<IAccountInfo[] | []>([]);
  const [ascending, setAscending] = useState(true);


  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [totalNumberOfPages, setTotalNumberOfPages] = useState(Math.ceil(searchAccounts.length / itemsPerPage));



  useEffect(() => {
    console.log('x');

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
    const splitData = data.split(/\n\s*\n/);
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
    console.log('Loading...');
    return <main className='flex justify-center items-center text-5xl h-52'>Loading...</main>

  }
  if (error) {
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
      console.log(nintendoGames);

      const hasCommonString = queries.some(str1 =>
        nintendoGames[i].games.some((str2: any) => str2.toLowerCase().includes(str1.toLowerCase()))
      );
      if (hasCommonString) {
        matches.push(nintendoGames[i]);
      }
      // }
    }
    setSearchAccouts(matches)

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
        <div className={`text-center text-2xl text-rose-900 ${montserrat.className}`}>Available Accounts</div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 m-8">
          {itemsToDisplay.map((acc: any) => <Card key={acc.id} account={acc} />)}
        </div>
        <Pagination totalPages={totalNumberOfPages} currentPage={currentPage} onSetCurrentPage={setCurrentPage} />
      </section>
    </main >
  )
}


function Card({ account }: any) {
  // const regex = /-\?\[?\d+(?:\.\d)?\sUSD\]?/g;
  const regex = /-?\s?\$?\[?\d+(?:\.\d{1,2})?\s?USD\]?/g;
  const regex2 = /\-?\s\$\d+(?:\.\d{1,2})?/g;
  const span = (account.games.length > 6) ? 'col-span-2' : ''
  return <div className={`hover:scale-[1.05] transition duration-300 p-1 bg-white border border-gray-200 rounded-lg shadow ${span}`}>
    <div className='flex justify-between bg-slate-200 p-3 rounded-md shadow-md'>
      <div className='bg-rose-500 text-white text-sm lg:text-lg font-medium md:px-2.5 h-6 lg:h-8 rounded'>#{account.id}</div>
      <div className='font-bold'>
        <div>Price: {account.price}</div>
        <div>Games: {account.games.length}</div>
      </div>
    </div>
    <div className='bg-gray-200-100'>

      <div className='p-6 '>
        <ul>
          {account.games.map((game: any, index: number) => {

            const outputString1 = game.replace(regex, "");
            const outputString2 = outputString1.replace(regex2, "");
            return <>
              <li key={index}>{outputString2}</li>
              <hr />
            </>
          })}
        </ul>

      </div>
    </div>
  </div>
}

function Pagination({ totalPages, currentPage, onSetCurrentPage }: any) {
  return <div>

    <nav aria-label="Page navigation example">
      <ul className="flex items-center justify-center -space-x-px mb-5">
        <li>
          <button onClick={() => {
            onSetCurrentPage(Math.max(1, currentPage - 1));
          }} className="block px-3 py-2 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 ">
            <span className="sr-only">Previous</span>
            <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
          </button>
        </li>
        <li>
          <a href="#" className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 ">{currentPage} / {totalPages}</a>
        </li>
        <li>
          <button onClick={() => {
            onSetCurrentPage(Math.min(currentPage + 1, totalPages));

          }} className="block px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 ">
            <span className="sr-only">Next</span>
            <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path></svg>
          </button>
        </li>
      </ul>
    </nav>

  </div>
}