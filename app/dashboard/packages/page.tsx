'use client'

import NewPackageForm from '@/app/components/newPackageForm';
import styles from './styles.module.css';
import { usePackageStore } from "@/app/store/packageStore"
import { ApiResponse } from "@/app/types/api"
import { Calendar, FilePlusIcon, CheckCircle, Users2 } from "lucide-react"
import { useEffect, useState } from "react"
import { Package } from '@/app/entity/package';
import { emptyPackge } from '@/app/data/package';

export default function Packages() {
    const { setPackages, packages, setPackage } = usePackageStore();
    const [confirmDelete, setComfirmDelete] = useState<string>('');
    const [showNewPackageForm, setShowNewPackageForm] = useState<boolean>(false);
    const handleGetPackage = async () => {
        const res = await fetch('/api/package', {
            method: 'GET',
            cache: 'no-store',
        })
        const response: ApiResponse = await res.json();
        if (response.code === 'MISSING_PACKAGE') {
            setPackages([]);
        }
        setPackages(response.data)

    }
    const handleDeltePackage = async () => {
        try {
            const res = await fetch(`/api/package/${confirmDelete}`, {
                method: 'DELETE'
            });
            const response: ApiResponse = await res.json()
            if (!response.success) {
                throw new Error(response.message)
            }
            const removingPackage: Package[] = packages.filter(pkg => pkg.id !== confirmDelete)
            setPackages(removingPackage)
        } catch (error: any) {
            console.log('error ', error.message);
        } finally {
            setComfirmDelete('')
        }
    }
    const handleEditPackage = (package_id: string) => {
        setShowNewPackageForm(true);
        const _package: Package | undefined = packages.find(pkg => pkg.id === package_id);
        console.log(_package?.id);
        
        if (_package) {
            setPackage({ ..._package, id:_package.id });
        }
        return
    }
    useEffect(() => {
        handleGetPackage();
    }, [])


    return <section className="flex flex-col gap-4 p-10 pt-0 relative">
        {
            confirmDelete ? <div className='flex items-center justify-center fixed top-0 left-0 w-full h-full bg-zinc-950/30'>
                <div className="flex flex-col gap-4  p-10 rounded-lg bg-white">
                    <p className='text-2xl font-bold'>¿Seguro que deseas eliminar el paquete?</p>
                    <div className='flex gap-4 justify-between'>
                        <button onClick={() => setComfirmDelete('')} className="w-full p-2 rounded-lg text-zinc-400 bg-zinc-50 cursor-pointer">Cancelar</button>
                        <button onClick={() => handleDeltePackage()} className="w-full text-red-400 bg-red-100 p-2 rounded-lg cursor-pointer">Confirmar</button>
                    </div>
                </div>
            </div> : null
        }
        {
            showNewPackageForm ? <div className='flex items-center justify-center fixed top-0 left-0 w-full h-full bg-zinc-950/20'>
                <NewPackageForm setShowNewPackageForm={setShowNewPackageForm} />
            </div> : null
        }
        <div className='flex justify-end'>
            <button onClick={() => setShowNewPackageForm(true)} className='flex items-center gap-2 my-2 border border-blue-400 px-4 rounded-full bg-blue-50 text-blue-500 py-2'>
                <FilePlusIcon size={15} />
                Agregar
            </button>
        </div>
        {
            packages?.length ?
                <ul className={styles.packages}>
                    {packages?.map(pkg => (
                        <li key={pkg.id} className={styles["package__card"]}>
                            <div>
                                <p className={styles["package__name"]}>{pkg.name}</p>
                                <strong className={styles["package__price"]}>${pkg.price}</strong>
                                <ul className={styles.benefits}>
                                    {pkg.benefits.map(ben => (
                                        <li key={ben} className={styles.benefit}>
                                            <CheckCircle size={13} className="text-blue-500" />
                                            {ben}
                                        </li>
                                    ))}
                                    <li className={styles.benefit}>
                                        <Users2 size={13} className="text-blue-500" />
                                        Hasta {pkg.group_size} personas
                                    </li>
                                    <li className={styles.benefit}>
                                        <Calendar size={13} className="text-blue-500" />
                                        {pkg.duration_days}
                                    </li>
                                </ul>
                            </div>
                            <div className="flex gap-4 justify-between">
                                <button onClick={() => handleEditPackage(pkg.id!)} className="w-full p-2 rounded-lg text-blue-400 bg-blue-50 cursor-pointer">Editar</button>
                                <button onClick={() => setComfirmDelete(pkg.id!)} className="w-full text-red-400 bg-red-100 p-2 rounded-lg cursor-pointer">Eliminar</button>
                            </div>
                        </li>
                    ))}
                </ul>
                : <p className='font-bold text-5xl text-zinc-300'>
                    No hay paquetes creados
                </p>
        }

    </section>
}