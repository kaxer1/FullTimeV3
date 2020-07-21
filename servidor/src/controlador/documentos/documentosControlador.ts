import { Request, Response } from 'express';
import pool from '../../database';

class DocumentosControlador {

    public async ListarDocumentos(req: Request, res: Response) {
        const DOCUMENTOS = await pool.query('SELECT * FROM documentacion ORDER BY id');
        if (DOCUMENTOS.rowCount > 0) {
            return res.jsonp(DOCUMENTOS.rows)
        }
        else {
            return res.status(404).jsonp({ text: 'No se encuentran registros' });
        }
    }

    public async ObtenerUnDocumento(req: Request, res: Response): Promise<any> {
        const { id } = req.params;
        const UN_DOCUMENTO = await pool.query('SELECT * FROM documentacion WHERE id = $1', [id]);
        if (UN_DOCUMENTO.rowCount > 0) {
            return res.jsonp(UN_DOCUMENTO.rows)
        }
        else {
            res.status(404).jsonp({ text: 'No se encuentran registros' });
        }
    }

    public async CrearDocumento(req: Request, res: Response): Promise<void> {
        const { doc_nombre } = req.body;
        await pool.query('INSERT INTO documentacion (doc_nombre) VALUES ($1)', [doc_nombre]);
        const ultimo = await pool.query('SELECT MAX(id) AS id FROM documentacion');
        res.jsonp({ message: 'Documento cargado', id: ultimo.rows[0].id });
    }

    public async EditarDocumento(req: Request, res: Response): Promise<void> {
        const id = req.params.id;
        const { doc_nombre } = req.body;
        await pool.query('UPDATE documentacion SET doc_nombre = $1 WHERE id = $2', [doc_nombre, id]);
        res.jsonp({ message: 'Documento actualizado' });
    }

    public async ObtenerDocumento(req: Request, res: Response): Promise<any> {
        const docs = req.params.docs;
        let filePath = `servidor\\documentacion\\${docs}`
        res.sendFile(__dirname.split("servidor")[0] + filePath);
    }

    public async GuardarDocumentos(req: Request, res: Response): Promise<void> {
        let list: any = req.files;
        let doc = list.uploads[0].path.split("\\")[1];
        let id = req.params.id
        await pool.query('UPDATE documentacion SET documento = $2 WHERE id = $1', [id, doc]);
        res.jsonp({ message: 'Documento Guardado' });
    }

}

export const DOCUMENTOS_CONTROLADOR = new DocumentosControlador();

export default DOCUMENTOS_CONTROLADOR;