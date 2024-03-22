"use client"

import H1, { h1IconClasses } from '@/components/content/h1';
import { Input } from '@/components/ui/input';
import { ChevronLeftIcon, RatioIcon } from 'lucide-react';
import { useState } from 'react';

import { tablesList } from './tablesList';
import { buttonVariants } from '@/components/ui/button';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Table from '@/components/tables/table';

type TablesList = {
  Nome: string
  Mesa: string
}

function removeAcento(text: string) {
  text = text.toLowerCase();
  text = text.replace(new RegExp('[ÁÀÂÃ]', 'gi'), 'a');
  text = text.replace(new RegExp('[ÉÈÊ]', 'gi'), 'e');
  text = text.replace(new RegExp('[ÍÌÎ]', 'gi'), 'i');
  text = text.replace(new RegExp('[ÓÒÔÕ]', 'gi'), 'o');
  text = text.replace(new RegExp('[ÚÙÛ]', 'gi'), 'u');
  text = text.replace(new RegExp('[Ç]', 'gi'), 'c');
  return text;
}

export default function Tables() {
  const [nameInput, setNameInput] = useState("")
  const [result, setResult] = useState<TablesList[]>([])

  const searchParams = useSearchParams()
  const tableTag = searchParams?.get('tag')

  function handleNameInput(input: string) {
    setNameInput(input)

    let searchingResult: TablesList[] = []

    const normalizedSearchInput = removeAcento(input.toLowerCase())

    tablesList.map((guest) => {
      const normalizedName = removeAcento(guest.Nome.toLowerCase())
      const normalizedTable = removeAcento(guest.Mesa.toLowerCase())

      const searchByNameIndex = normalizedName.search(normalizedSearchInput)
      const searchByTableIndex = normalizedTable.search(normalizedSearchInput)

      if (searchByTableIndex >= 0 || searchByNameIndex >= 0) {
        return searchingResult.push(guest)
      }
    })

    setResult(searchingResult)
  }

  return (
    <div className='flex flex-col items-center my-4 px-2'>
      {
        tableTag ? (
          <>
            <H1
              icon={<RatioIcon className={h1IconClasses} strokeWidth={1.5} />}
              subtitle={`Sua mesa é a dos ${tableTag}`}
            >
              Mesas na Recepção
            </H1>

            <Link
              href={"/Tables"}
              className={buttonVariants({ variant: 'outline' }) + " justify-between gap-2 mb-4"}
            >
              <ChevronLeftIcon /> Pesquisar outro nome
            </Link>

            <div className='mx-2'>
              <div className='sm:w-auto max-w-screen relative scale-50 -top-52 sm:scale-75 sm:-top-24 lg:scale-100 lg:top-0 overflow-x-auto pb-4 px-2'>

                <div className='grid grid-cols-2 gap-y-20 mb-4 max-w-screen'>
                  <div className='relative top-10 justify-self-end right-4'>
                    <Table currentTag={tableTag} tag='Tios Domingos de Castro' rotation='rotate-[60deg]' />
                  </div>
                  <div className='relative top-10 left-4'>
                    <Table currentTag={tableTag} tag='Domingos de Castro' rotation='-rotate-[60deg]' />
                  </div>
                  <div className='relative -top-10 justify-self-end right-40'>
                    <Table currentTag={tableTag} tag='Almeida' rotation='rotate-[30deg]' />
                  </div>
                  <div className='relative -top-10 left-40'>
                    <Table currentTag={tableTag} tag='Cardoso' rotation='-rotate-[30deg]' />
                  </div>
                </div>

                <div className='flex flex-row items-start justify-center'>
                  <div className='flex flex-col items-start gap-y-2'>
                    <Table currentTag={tableTag} tag='Costa de Almeida' />
                    <Table currentTag={tableTag} tag='Kerber' />
                    <Table currentTag={tableTag} tag='Amigos de Jampa' />
                  </div>
                  <div className='w-96 m-4 h-auto flex flex-col items-center align-top'>
                    <span className='text-primary font-semibold whitespace-nowrap'>Na sua mesa, também estarão:</span>
                    <ul className='list-disc pl-12'>
                      {
                        tablesList.filter((guest) => {
                          return guest.Mesa === tableTag
                        }).sort((a, b) => {
                          let fa = a.Nome.normalize("NFD").toLowerCase(),
                            fb = b.Nome.normalize("NFD").toLowerCase();

                          if (fa < fb) {
                            return -1;
                          }
                          if (fa > fb) {
                            return 1;
                          }
                          return 0;
                        }).
                          map((guest) => {
                            return <li key={guest.Nome}>{guest.Nome}</li>
                          })
                      }
                    </ul>
                  </div>
                  <div className='flex flex-col items-end gap-y-2'>
                    <Table currentTag={tableTag} tag='Soares' />
                    <Table currentTag={tableTag} tag='Primos Soares' />
                    <Table currentTag={tableTag} tag='Amigos de Sanja' />
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <H1
              icon={<RatioIcon className={h1IconClasses} strokeWidth={1.5} />}
              subtitle={`Digite seu nome para saber sua mesa`}
            >
              Mesas na Recepção
            </H1>

            <Input
              className='mb-3 w-auto sm:w-80'
              value={nameInput}
              onChange={(e) => handleNameInput(e.target.value)}
              placeholder='seu nome ou da mesa...'
            />

            {
              nameInput.length > 0 && (
                <div className='flex flex-col p-2 max-w-screen gap-1'>
                  {result.map((guest) => {
                    return (
                      <Link
                        key={guest.Nome}
                        className={buttonVariants({ variant: 'outline' }) + " justify-between h-auto"}
                        href={`/Tables?tag=${guest.Mesa}`}
                      >
                        <b className='flex flex-1'>{guest.Nome}</b>
                        <div className='flex items-center justify-end text-end w-fit'>
                          <RatioIcon className='w-4 ml-3 mr-1' />
                          <span>{guest.Mesa}</span>

                        </div>
                      </Link>
                    )
                  })}
                </div>
              )
            }
          </>
        )
      }



    </div>
  );
}
