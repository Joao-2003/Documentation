import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, Legend, Cell 
} from 'recharts';
import { CloudRain, Calendar, MapPin, Droplets, ChevronDown, ChevronUp } from 'lucide-react';

const App = () => {
  const [formData, setFormData] = useState({
    lat: '',
    lon: '',
    startDate: '',
    endDate: ''
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [showTable, setShowTable] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const fetchPluviometry = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const { lat, lon, startDate, endDate } = formData;
      // Substitua pela URL do seu backend Spring Boot
      const response = await fetch(
        `http://localhost:8080/api/v1/weather/pluviometry?lat=${lat}&lon=${lon}&startDate=${startDate}&endDate=${endDate}`
      );

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || 'Falha ao buscar dados meteorológicos.');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Formatação de data para o gráfico (DD/MM)
  const formatChartData = (history) => {
    return history.map(item => ({
      ...item,
      displayDate: new Date(item.date).toLocaleDateString('pt-PT', { day: '2-digit', month: '2-digit' })
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans text-slate-900">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <header className="mb-8 text-center md:text-left flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-emerald-800 flex items-center gap-2">
              <CloudRain className="text-emerald-600" /> 
              Monitorização Pluviométrica
            </h1>
            <p className="text-slate-600 mt-1">Análise histórica para safras de soja e gestão de talhões.</p>
          </div>
          <div className="bg-emerald-100 text-emerald-800 px-4 py-2 rounded-full text-sm font-semibold self-center md:self-auto">
            Safra de Soja
          </div>
        </header>

        {/* Formulário */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-8">
          <form onSubmit={fetchPluviometry} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1">
                <MapPin size={14} /> Latitude
              </label>
              <input
                type="number" step="any" name="lat" required
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                value={formData.lat} onChange={handleInputChange}
                placeholder="-15.79"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1">
                <MapPin size={14} /> Longitude
              </label>
              <input
                type="number" step="any" name="lon" required
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                value={formData.lon} onChange={handleInputChange}
                placeholder="-47.88"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1">
                <Calendar size={14} /> Plantio
              </label>
              <input
                type="date" name="startDate" required
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                value={formData.startDate} onChange={handleInputChange}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1">
                <Calendar size={14} /> Colheita
              </label>
              <input
                type="date" name="endDate" required
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                value={formData.endDate} onChange={handleInputChange}
              />
            </div>
            <div className="md:col-span-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-emerald-200 disabled:opacity-50 flex justify-center items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    A processar dados históricos...
                  </>
                ) : 'Gerar Relatório Pluviométrico'}
              </button>
            </div>
          </form>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-lg animate-pulse">
            <strong>Erro:</strong> {error}
          </div>
        )}

        {result && (
          <div className="space-y-8 animate-in fade-in duration-500">
            
            {/* Cards de Resumo */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
                <div className="bg-blue-100 p-3 rounded-xl text-blue-600">
                  <Droplets size={24} />
                </div>
                <div>
                  <p className="text-sm text-slate-500 font-medium">Total Acumulado</p>
                  <p className="text-2xl font-black text-blue-600">{result.totalAccumulated.toFixed(1)} mm</p>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
                <div className="bg-emerald-100 p-3 rounded-xl text-emerald-600">
                  <CloudRain size={24} />
                </div>
                <div>
                  <p className="text-sm text-slate-500 font-medium">Média Diária</p>
                  <p className="text-2xl font-black text-emerald-600">{result.dailyAverage.toFixed(2)} mm</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
                <div className="bg-amber-100 p-3 rounded-xl text-amber-600">
                  <Calendar size={24} />
                </div>
                <div>
                  <p className="text-sm text-slate-500 font-medium">Dias em Campo</p>
                  <p className="text-2xl font-black text-amber-600">{result.periodDays} dias</p>
                </div>
              </div>
            </div>

            {/* Gráfico */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                Precipitação Diária no Período
              </h3>
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={formatChartData(result.history)}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="displayDate" 
                      fontSize={12} 
                      tickLine={false} 
                      axisLine={false}
                      minTickGap={20}
                    />
                    <YAxis 
                      fontSize={12} 
                      tickLine={false} 
                      axisLine={false} 
                      label={{ value: 'mm', angle: -90, position: 'insideLeft', style: {textAnchor: 'middle'} }}
                    />
                    <Tooltip 
                      cursor={{fill: '#f8fafc'}}
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      formatter={(value) => [`${value.toFixed(1)} mm`, 'Chuva']}
                      labelFormatter={(label) => `Data: ${label}`}
                    />
                    <Bar dataKey="rain" radius={[4, 4, 0, 0]}>
                      {formatChartData(result.history).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.rain > 5 ? '#2563eb' : '#93c5fd'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 flex justify-center gap-6 text-xs font-medium text-slate-500">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-sm bg-blue-600"></div> Chuva Forte ({'>'}5mm)
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-sm bg-blue-300"></div> Chuva Leve/Moderada
                </div>
              </div>
            </div>

            {/* Tabela Detalhada (Toggle) */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <button 
                onClick={() => setShowTable(!showTable)}
                className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
              >
                <span className="font-bold text-slate-700">Dados Diários Detalhados</span>
                {showTable ? <ChevronUp /> : <ChevronDown />}
              </button>
              
              {showTable && (
                <div className="overflow-x-auto border-t border-slate-100">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Data</th>
                        <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Volume (mm)</th>
                        <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {result.history.map((day, idx) => (
                        <tr key={idx} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4 text-sm text-slate-600 font-medium">
                            {new Date(day.date).toLocaleDateString('pt-PT')}
                          </td>
                          <td className="px-6 py-4 text-sm font-bold text-blue-600">
                            {day.rain.toFixed(2)} mm
                          </td>
                          <td className="px-6 py-4">
                            {day.rain > 0 ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                Precipitação
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                                Estiagem
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
