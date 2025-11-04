'use client'
import { ChangeEvent, Dispatch, FormEvent, SetStateAction, useState } from 'react';
import styles from './styles.module.css';
import { ApiResponse } from '@/app/types/api';
import { Calendar, Delete, DollarSign, Phone, Plus, Trash, Users2, X } from 'lucide-react';
import { Package } from '@/app/entity/package';
import { usePackageStore } from '@/app/store/packageStore';
import { Customer } from '@/app/entity/customer';
import { DatePicker, DatePickerProps } from 'antd';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import locale from 'antd/es/date-picker/locale/es_ES';
import { useCustomerStore } from '@/app/store/customerStore';
import { usePackages } from '@/app/hooks/usePackages';
dayjs.locale('es');
import { spanishFormat } from '@/app/lib/formatting';
import { emptyPackge } from '@/app/data/package';
import PackagesList from './packagesList';

export default function NewUserForm({ showForm }: { showForm: Dispatch<SetStateAction<boolean>> }) {
    usePackages(true)
    
    const [user, setUser] = useState<Customer>({ name: '', phone: '' } as Customer);
    const {customers} = useCustomerStore();
    const [newCustomers, setNewCustomers] = useState<Customer[]>([])
    const [customerList, setCustomerList]=useState<Customer[]>(customers);
    const [packageSelected, setPackageSelected] = useState<Package>(emptyPackge);

    const handleOnCahnge = (event: ChangeEvent<HTMLInputElement>) => {
        const field: string = event.currentTarget.name
        let value: string = event.currentTarget.value
        const newCustomerList:Customer[] = customers.filter(c=>c.name.toLowerCase().includes(value.toLowerCase()));
        setCustomerList(newCustomerList);
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
            const data: ApiResponse = await res.json();
            if (!data.success) {
                throw new Error(data.message)
            }
            showForm(false);

        } catch (err) {
            console.error('Error en fetch:', err)
        }
    }
    const addNewCustomer = (customer: Customer) => {
        if(packageSelected.group_size==newCustomers.length)return;
        if(customer.name===''||customer.phone==="") return;
        const alreadyAdded = newCustomers.findIndex(c=>c.name.toLowerCase()===customer.name.toLowerCase())
        
        if(alreadyAdded>=0)return

        if(!customer.id){
            customer.id = `${customer.name}-CREATE_CUSTOMER`
        }
        setNewCustomers([...newCustomers, { name: customer.name, phone: customer.phone, id: customer.id }])
        setUser({ name: '', phone: '' })
        
    }
    const onChange: DatePickerProps['onChange'] = (date, dateString) => {
        console.log(date, dateString);
    };
    return <form onSubmit={handleOnSubmit} className={styles.form}>
        <PackagesList packageSelected={packageSelected} setPackageSelected={setPackageSelected} setNewCustomers={setNewCustomers}/>
        {
            packageSelected.id ?
                <div className='flex flex-col gap-6'>
                    <label htmlFor="registered_day">
                        Fecha de inicio
                        <DatePicker className={styles['date_picker']} onChange={onChange} locale={locale} format={spanishFormat} />
                    </label>
                    <hr className='text-zinc-300' />
                    <section className={styles.users}>
                        {
                            Array.from({length:packageSelected?.group_size-newCustomers.length},(_,i)=>(
                                <div className='flex items-center justify-center bg-zinc-100 border border-dashed h-24 rounded-lg opacity-25'>
                                    <Users2 size={30} className='text-zinc-400'/>
                                </div>
                            ))
                        }
                        {
                            newCustomers?.map(nc => (
                                <p key={nc.id} className='relative gap-10 bg-gray-100 p-2 rounded-md'>
                                    {nc.name}
                                    <p className='flex items-center w-fit gap-2 my-2'>
                                        <Phone size={15} /> <span className='bg-blue-400 text-white rounded-lg px-2'>{nc.phone}</span>
                                    </p>
                                    <Trash className='absolute top-4 right-4 cursor-pointer hover:text-red-300' onClick={() => {
                                        const c = newCustomers.filter(e => e.id !== nc.id)
                                        setNewCustomers([...c])
                                    }} size={13} />
                                </p>
                            ))
                        }
                    </section>
                    <section className='flex gap-2'>
                        <label htmlFor="name">
                            Nombre y apellido
                            <input onChange={handleOnCahnge} value={user.name || ""} type="text" id="name" name="name" />
                            {user.name ? <ul className={styles['customers-list']}>
                                {customerList?.map(c => <li key={c.id} onClick={() => addNewCustomer(c)}>{c.name}</li>)}
                            </ul> :undefined}
                        </label>
                        <label htmlFor="phone">
                            Telefono
                            <input onChange={handleOnCahnge} value={user.phone || ""} type="tel" pattern="^\+?[0-9\s\-]{7,15}$" id="phone" name="phone" />
                        </label>
                        <div className='pt-8'>
                            <Plus onClick={()=>addNewCustomer({...user})} className='border rounded-lg p-1 cursor-pointer text-zinc-400 hover:bg-blue-500 hover:text-white' size={30}/>
                        </div>
                    </section>
                </div> : undefined
        }
        <div className='flex gap-2 justify-end'>
            <button onClick={() => showForm(false)} className='p-2 px-4 rounded-lg cursor-pointer border border-zinc-400'>Cancelar</button>
            <button className='p-2 px-4 rounded-lg cursor-pointer border border-blue-500 text-blue-500'>Aceptar</button>
        </div>
    </form>
}