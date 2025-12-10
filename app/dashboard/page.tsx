'use client'

import styles from './style.module.css';
import { ArrowUpIcon, ChartArea, Check, CheckCircle2, DollarSign, Plus, TriangleAlert, Users2Icon } from "lucide-react";
import { useState } from 'react';
import NewSubForm from '../components/newSubForm';
import { useCheckin } from '../hooks/useCheckin';
import { toast } from 'sonner';
import { useCheckinStore } from '../store/checkin';
import CheckinModal from '../components/checkin';

export default function Home() {
    const [showForm, setShowForm] = useState<boolean>(false);
    const [showCheckin, setShowCheckin] = useState<boolean>(false);
    const {getAllCheckin} = useCheckin();
    const customerCheckIns = useCheckinStore(s=>s.customerCheckIns);
    
    const handleShowNewUserform = () => {
        setShowForm(true)
    }

    const handleCheckin = async()=>{
        try {
            setShowCheckin(true)
            await getAllCheckin();
        } catch (error) {
            toast.error("Error al cargar la lista de asistencia. Recargue la pagina")
        }
    }

    return <>
        {showForm?<div className='fixed inset-0 flex items-center justify-center w-[calc(100%-13em)] h-full bg-zinc-900/10 z-10'>
            <NewSubForm/>
        </div>:null}
        {showCheckin?<div 
        onClick={(e)=>e.target === e.currentTarget && setShowCheckin(false)}
        className='fixed top-0 lef-0 flex items-center justify-center w-[calc(100%-13em)] h-full bg-zinc-900/10 z-10'>
            <CheckinModal/>
        </div>:null}
        <section className={styles.home}>
            <ul className="grid grid-cols-3 pt-10 gap-10">
                <li>
                    <button onClick={handleShowNewUserform} className={styles.action}>
                        <Plus size={30} />
                        <div>
                            <p className={styles['action__headline']}>Nueva suscripción</p>
                            <p>Registra Suscripción</p>
                        </div>
                    </button>
                </li>
                <li onClick={handleCheckin}>
                    <button className={styles.action}>
                        <Check size={30} />
                        <div>
                            <p className={styles['action__headline']}>Check-in</p>
                            <p>Registrar Asistencia</p>
                        </div>
                    </button>
                </li>
                <li>
                    <button className={styles.action}>
                        <DollarSign size={30} />
                        <div>
                            <p className={styles['action__headline']}>Registrar Pago</p>
                            <p>Registrar Pago</p>
                        </div>
                    </button>
                </li>
            </ul>
            <ul className={styles.gadgets}>
                <li className={styles.gadget}>
                    <Users2Icon size={50} />
                    <strong>17</strong>
                    <div>
                        <p>Miembros activos</p>
                        <p>
                            <ArrowUpIcon size={15} />
                            12% este mes
                        </p>
                    </div>
                </li>
                <li className={styles.gadget}>
                    <CheckCircle2 size={50} />
                    <strong>{customerCheckIns.filter(c=>c.checkin.check_in_date!=='').length}</strong>
                    <div>
                        <p>Check-in hoy</p>
                        <p>
                            <ChartArea size={15} />
                            Promedio: 7
                        </p>
                    </div>
                </li>
                <li className={styles.gadget}>
                    <DollarSign size={50} />
                    <strong>$2.5K</strong>
                    <div>
                        <p>Ingresos mes</p>
                        <p>
                            <ArrowUpIcon size={15} />
                            5% vs anterior
                        </p>
                    </div>
                </li>
                <li className={styles.gadget}>
                    <TriangleAlert size={50} />
                    <strong>4</strong>
                    <div>
                        <p>Por vencer</p>
                        <p>
                            Proximos días
                        </p>
                    </div>
                </li>
            </ul>
            <div className={styles.table}>
                <h2 className='font-extrabold border-l-2 border-zinc-700 text-2xl pl-6'>Miembros</h2>
                <hr />
                <table>
                    <thead className='rounded-2xl'>
                        <tr>
                            <th>Nombre</th>
                            <th>Membresia</th>
                            <th>Vencimiento</th>
                            <th>Estado</th>
                            <th>Acción</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <th scope='row'>Rogelio Beltran</th>
                            <td>Mensual</td>
                            <th>15 de sep 2025</th>
                            <th>Por vencer</th>
                            <th>Pagar</th>
                        </tr>
                        <tr>
                            <th scope='row'>Rogelio Beltran</th>
                            <td>Mensual</td>
                            <th>15 de sep 2025</th>
                            <th>Por vencer</th>
                            <th>Pagar</th>
                        </tr>
                        <tr>
                            <th scope='row'>Rogelio Beltran</th>
                            <td>Mensual</td>
                            <th>15 de sep 2025</th>
                            <th>Por vencer</th>
                            <th>Pagar</th>
                        </tr>
                        <tr>
                            <th scope='row'>Rogelio Beltran</th>
                            <td>Mensual</td>
                            <th>15 de sep 2025</th>
                            <th>Por vencer</th>
                            <th>Pagar</th>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>
    </>
}