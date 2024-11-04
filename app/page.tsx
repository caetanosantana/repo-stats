'use client'

import { useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { ListaUsers } from '@/components/ListaUsers'
import { GraficoEstrelas } from '@/components/GraficoEstrelas'
import { Github } from 'lucide-react';
import { History, Heart, Star } from 'lucide-react';
import dados from '@/data/thefuck-sample-100.json'

function formatarDados(dados: any) {
  return dados.map(item => ({
    data: new Date(item.starred_at).toISOString().split('T')[0],
    estrelas: 1,
  })).sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime())
}

function calcularDadosCumulativos(dadosProcessados: any) {
  let estrelasCumulativas = 0
  return dadosProcessados.map(item => ({
    data: item.data,
    estrelas: (estrelasCumulativas += item.estrelas),
  }))
}

function selecionarUsuarios(dados: any, criterio: 'primeiros' | 'ultimos' | 'populares') {
  switch (criterio) {
    case 'primeiros':
      return [...dados].sort((a, b) => new Date(a.starred_at).getTime() - new Date(b.starred_at).getTime()).slice(0, 5)
    case 'ultimos':
      return [...dados].sort((a, b) => new Date(b.starred_at).getTime() - new Date(a.starred_at).getTime()).slice(0, 5)
    case 'populares':
      return [...dados].sort((a, b) => b.user.followers - a.user.followers).slice(0, 5)
  }
}

export default function Painel() {
  const [agruparPor, setAgruparPor] = useState('mes')
  const [tipoGrafico, setTipoGrafico] = useState('cumulativo')
  const [intervaloTempo, setIntervaloTempo] = useState('todos')

  const dadosProcessados = formatarDados(dados)
  const dadosCumulativos = calcularDadosCumulativos(dadosProcessados)

  const primeirosUsuarios = selecionarUsuarios(dados, 'primeiros')
  const ultimosUsuarios = selecionarUsuarios(dados, 'ultimos')
  const usuariosPopulares = selecionarUsuarios(dados, 'populares')

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

      <div  className="flex gap-4 justify-betweeni items-start">
        <ListaUsers titulo="Primeiros" usuarios={primeirosUsuarios} icon={Heart} />
        <ListaUsers titulo="Últimos" usuarios={ultimosUsuarios} icon={History} />
        <ListaUsers titulo="Populares" usuarios={usuariosPopulares} icon={Star} />
      </div>
    </div>
  )
}
