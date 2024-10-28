'use client'

import { useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { ListaUsers } from '@/components/ListaUsers'
import { GraficoEstrelas } from '@/components/GraficoEstrelas'
import { Github } from 'lucide-react';
import dados from '@/data/thefuck-sample-100.json'
import { History } from 'lucide-react';
import { Heart } from 'lucide-react';
import { Star } from 'lucide-react';

export default function Painel() {
  const [agruparPor, setAgruparPor] = useState('mes')
  const [tipoGrafico, setTipoGrafico] = useState('cumulativo')
  const [intervaloTempo, setIntervaloTempo] = useState('todos')

  const dadosProcessados = dados.map(item => ({
    data: new Date(item.starred_at).toISOString().split('T')[0],
    estrelas: 1
  })).sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime())

  let estrelasCumulativas = 0
  const dadosCumulativos = dadosProcessados.map(item => ({
    data: item.data,
    estrelas: (estrelasCumulativas += item.estrelas)
  }))

  const primeirosUsuarios = [...dados].sort((a, b) => 
    new Date(a.starred_at).getTime() - new Date(b.starred_at).getTime()
  ).slice(0, 5)

  const ultimosUsuarios = [...dados].sort((a, b) => 
    new Date(b.starred_at).getTime() - new Date(a.starred_at).getTime()
  ).slice(0, 5)

  const suariosPopulares = [...dados].sort((a, b) => 
    b.user.followers - a.user.followers
  ).slice(0, 5)

  return (
    <div className="container mx-auto p-4 grid items-center justify-items-center min-h-screen">
      <header className='flex items-center mb-4 gap-2'>
        <Github />
        <h1 className="text-2xl font-bold">nvbn/thefuck</h1>
      </header>
      
      
      <Card className="mb-8 w-3/5 p-8">
        <CardContent>
        <GraficoEstrelas 
            dados={dadosCumulativos} 
            agruparPor={agruparPor} 
            tipoGrafico={tipoGrafico} 
            intervaloTempo={intervaloTempo}
            onAgruparChange={setAgruparPor}
            onTipoChange={setTipoGrafico}
            onTempoChange={setIntervaloTempo}
          />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-3/5">
        <ListaUsers titulo="Primeiros" usuarios={primeirosUsuarios} icon={Heart}/>
        <ListaUsers titulo="Últimos" usuarios={ultimosUsuarios} icon={History}/>
        <ListaUsers titulo="Populares" usuarios={suariosPopulares} icon={Star}/>
      </div>
    </div>
  )
}