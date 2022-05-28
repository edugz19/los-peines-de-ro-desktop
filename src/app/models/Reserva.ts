export class Reserva {
    id: string;
    uid: string;
    nombre: string;
    servicio: string;
    horaInicio: string;
    horaFin: string;
    fecha: string;
    precio: number;
    pagado: boolean;
    completada?: boolean;
    urlTicket?: string;
}
