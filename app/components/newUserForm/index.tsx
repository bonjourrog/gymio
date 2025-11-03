'use client'
import { ChangeEvent, Dispatch, FormEvent, SetStateAction, useEffect, useState } from 'react';
import styles from './styles.module.css';
import { ApiResponse } from '@/app/types/api';
import { X } from 'lucide-react';
import { Package } from '@/app/entity/package';
import { usePackageStore } from '@/app/store/packageStore';
import { Customer } from '@/app/entity/customer';

export default function NewUserForm({showForm}:{showForm:Dispatch<SetStateAction<boolean>>}) {
    const [user, setUser] = useState<Customer>({ name: '', phone: '' } as Customer);
    const {packages, setPackages} = usePackageStore();
    const [newPackage, setNewPackage] = useState<Package>({
        name:'',
        price:0,
        benefits:[],
        duration_days:0,
        group_size:0,
        is_active:true,
    });
    const [loading, setLoading] = useState<boolean>(true)
    const handleOnCahnge = (event: ChangeEvent<HTMLInputElement>) => {
        const field: string = event.currentTarget.name
        let value: string = event.currentTarget.value
        if (field === 'phone') {
            if (value.length > 12) {
                return
            }
            value = value.replace(/\D/g, '')
            if (value.length > 6) {
                value = value.replace(/(\d{3})(\d{3})(\d+)/, '$1 $2 $3')
            } else if (value.length > 3) {
                value = value.replace(/(\d{3})(\d+)/, '$1 $2')
            }
        }
        setUser({ ...user, [field]: value });
    }
    const handleOnSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        if (user.name === "" || user.phone === "") return;
        try {
            const cleanNumber = user.phone.replace(/\s/g, '')
            const newUser: Customer = { ...user, phone: cleanNumber }
            const res = await fetch('/api/customer', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newUser),
            })
            const data:ApiResponse = await res.json();
            if(!data.success){
                throw new Error(data.message)
            }
            showForm(false);
            
        } catch (err) {
            console.error('Error en fetch:', err)
        }
    }
    const handleNewPackage = async()=>{
        try {
            const _newPackage:Package = {name:newPackage.name, price:newPackage.price, benefits:newPackage.benefits, duration_days:0, group_size:0, is_active:true}
            const res = await fetch('/api/package',{
                method:'POST',
                headers:{'Content-Type':'application/json'},
                body:JSON.stringify(_newPackage)
            })
            const response:ApiResponse = await res.json();
            if(!response.success){
                throw new Error(response.message)
            }
            setPackages([...packages, response.data])
        } catch (error) {
            console.log(error);
        }
    }
    const handlePackageRequest = async () => {
        try {
            const res = await fetch('/api/package', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });
            const data:ApiResponse = await res.json();
            if(!data.success && data.code === "MISSING_PACKAGE"){
                setPackages([]);
                setLoading(false);
                return;
            }
            setLoading(false);
            setPackages(data.data)
        } catch (error) {
            console.log(error);

        }
    }
    useEffect(() => {
        handlePackageRequest();
    }, [])
    return <form onSubmit={handleOnSubmit} className={styles.form}>
        <label htmlFor="name">
            Nombre y apellido
            <input onChange={handleOnCahnge} value={user.name || ""} type="text" id="name" name="name" />
        </label>

        <label htmlFor="phone">
            Telefono
            <input onChange={handleOnCahnge} value={user.phone || ""} type="tel" pattern="^\+?[0-9\s\-]{7,15}$" id="phone" name="phone" />
        </label>

        {
            loading?<label>Paquete <input type="text" disabled /></label>:packages.length===0?
            <div className={styles.package}>
                <label htmlFor="name">
                        <strong className='text-indigo-400'>Nombre del paquete</strong>
                        <input onChange={({ currentTarget: { value } }) => setNewPackage({ ...newPackage, name: value })} type="text" id='name' name='name' value={newPackage.name} />
                    </label>

                    <label htmlFor="price">
                        <strong className='text-indigo-400'>Precio</strong>
                        <input onChange={({ currentTarget: { value } }) => setNewPackage({ ...newPackage, price: Number(value) })} type="number" id='price' name='price' value={newPackage.price} />
                    </label>

                    <label htmlFor="benefits">
                        <div className='flex flex-wrap gap-1'>
                            {
                                newPackage.benefits.map((elem, index) => <p className='relative group text-indigo-300 bg-indigo-50 w-fit px-2 rounded-sm border border-dotted cursor-pointer hover:bg-red-50 hover:text-red-300' key={`${elem}-${index}`}>
                                    <X onClick={()=>setNewPackage({...newPackage, benefits:newPackage.benefits.filter(b=>b!==elem)})} className='absolute -right-3 -top-3 opacity-0 group-hover:opacity-100 bg-red-100 rounded-2xl p-1 z-10' size={20}/>
                                    {elem}
                                </p>)
                            }
                        </div>
                        <strong className='text-indigo-400'>Beneficios</strong>
                        <input onKeyDown={(e) => {
                            if(newPackage.benefits.length>10)return
                            if (e.key === "Enter" && e.currentTarget.value !== "") {
                                
                                setNewPackage({ ...newPackage, benefits: [...newPackage.benefits, e.currentTarget.value] })
                                e.currentTarget.value = ""
                            }

                        }} type="text" id='benefits' name='benefits' />
                    </label>
                    <button type='button' onClick={handleNewPackage} className='px-6 py-2 w-fit mx-auto  cursor-pointer rounded-md font-black bg-indigo-400 text-white'>Crear paquete</button>
                </div>
                : <>
                    <label htmlFor="package">
                        Paquete
                        <select name="" id="package">
                            {packages.map(pkg=>(<option key={`${pkg.name}-${pkg.id}`} value={pkg.name}>{pkg.name}</option>))}
                        </select>
                    </label>
                    <button className='px-6 py-2 w-fit mx-auto  cursor-pointer rounded-md font-black bg-indigo-400 text-white'>Crear</button>
                </>
        }
    </form>
}