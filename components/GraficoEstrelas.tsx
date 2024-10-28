'use client'

import { useMemo } from 'react'
import { Line } from 'react-chartjs-2'
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

export function GraficoEstrelas({
  dados,
  agruparPor,
  tipoGrafico,
  intervaloTempo,
  onAgruparChange,
  onTipoChange,
  onTempoChange}
) {
  
  const dadosProcessados = useMemo(() => {
    const agora = new Date()
    const dadosFiltrados = dados.filter(d => {
      const data = new Date(d.date)
      switch (intervaloTempo) {
        case '30d':
          return (agora.getTime() - data.getTime()) <= 30 * 24 * 60 * 60 * 1000
        case '6m':
          return (agora.getTime() - data.getTime()) <= 180 * 24 * 60 * 60 * 1000
        case '1a':
          return (agora.getTime() - data.getTime()) <= 365 * 24 * 60 * 60 * 1000
        default:
          return true
      }
    })

    const dadosAgrupados = dadosFiltrados.reduce((acc, curr) => {
      const data = new Date(curr.date)
      let chave

      switch (agruparPor) {
        case 'dia':
          chave = curr.date
          break
        case 'semana':
          const inicioSemana = new Date(data.setDate(data.getDate() - data.getDay()))
          chave = inicioSemana.toISOString().split('T')[0]
          break
        case 'mes':
          chave = `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, '0')}`
          break
        case 'ano':
          chave = data.getFullYear().toString()
          break
      }

      if (!acc[chave]) {
        acc[chave] = { date: chave, stars: 0 }
      }
      acc[chave].stars += tipoGrafico === 'absoluto' ? 1 : curr.stars
      return acc
    }, {} as Record<string, { date: string; stars: number }>)

    return Object.values(dadosAgrupados).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  }, [dados, agruparPor, tipoGrafico, intervaloTempo])

  const dadosGrafico = {
    labels: dadosProcessados.map(d => d.date),
    datasets: [
      {
        label: 'Estrelas',
        data: dadosProcessados.map(d => d.stars),
        borderColor: '#9095A0',
        tension: 0.1
      }
    ]
  }

  return (
    <div>
      <div className="flex justify-between mb-4">
        <div>
          <Label htmlFor="agrupamento" className='font-bold'>Agrupamento</Label>
          <Select value={agruparPor} onValueChange={onAgruparChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Agrupar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dia">Dia</SelectItem>
              <SelectItem value="semana">Semana</SelectItem>
              <SelectItem value="mes">Mês</SelectItem>
              <SelectItem value="ano">Ano</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="tipo">Tipo</Label>
          <Select value={tipoGrafico} onValueChange={onTipoChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Tipo do Gráfico" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="absoluto">Absoluto</SelectItem>
              <SelectItem value="cumulativo">Cumulativo</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="periodo">Período</Label>
          <Select value={intervaloTempo} onValueChange={onTempoChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Intervalo de Tempo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todo</SelectItem>
              <SelectItem value="30d">Últimos 30 dias</SelectItem>
              <SelectItem value="6m">Últimos 6 meses</SelectItem>
              <SelectItem value="1a">Último ano</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Line data={dadosGrafico} />
    </div>
  )
}