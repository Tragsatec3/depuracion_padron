// api/proxy.js
import fetch from 'node-fetch';

export default async function handler(req, res) {
  const { query } = req; // extrae los parámetros de consulta
  const baseURL = "http://ovc.catastro.meh.es/Cartografia/WMS/ServidorWMS.aspx?";

  const queryString = new URLSearchParams(query).toString();
  const url = `${baseURL}${queryString}`;

  try {
    const response = await fetch(url);
    const data = await response.text();
    res.status(200).send(data);
  } catch (error) {
    console.error('Error al obtener datos del WMS:', error);
    res.status(500).json({ message: 'Error al obtener datos del WMS' });
  }
}
