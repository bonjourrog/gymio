import { emptyPackge } from '@/app/data/package';
import styles from './styles.module.css';
import { Package } from "@/app/entity/package";
import { usePackageStore } from "@/app/store/packageStore";
import { Calendar, DollarSign, Plus, Trash, Users2 } from "lucide-react";
import { Dispatch, FC, SetStateAction } from 'react';
import { Customer } from '@/app/entity/customer';

interface PackagesListProps {
    packageSelected: Package,
    setPackageSelected: Dispatch<SetStateAction<Package>>;
    setNewCustomers: Dispatch<SetStateAction<Customer[]>>;
}

const PackagesList: FC<PackagesListProps> = ({ packageSelected, setPackageSelected, setNewCustomers }) => {
    const { packages } = usePackageStore();
    
    const handleSelectPackage = (package_id: string) => {
        if(!package_id)return;
        const _package: Package = packages.find(el => el.id === package_id) as Package;
        if(!_package)return
        setPackageSelected({ ..._package, id:package_id });
    }
    return <>
        <h2 className='font-black'>Selecciona un paquete</h2>
        {
            packageSelected.id ? <section className={styles.package}>
                <Trash onClick={() => {
                    setPackageSelected(emptyPackge)
                    setNewCustomers([])
                }} className='absolute right-6 top-6 text-zinc-400 hover:text-red-400' size={17} />
                <div className='bg-zinc-100 p-4 rounded-lg'>
                    <strong>{packageSelected.name}</strong>
                    <div className='flex gap-4 text-zinc-400 text-sm'>
                        <p>
                            <Users2 size={15} />
                            {packageSelected.group_size}
                        </p>
                        <p>
                            <Calendar size={15} />
                            {packageSelected.duration_days}
                        </p>
                    </div>
                </div>
                <p>
                    <DollarSign size={15} />
                    {packageSelected.price}
                </p>
            </section> : <ul>
                {packages.map(pkg => (
                    <li key={pkg.id} onClick={() => handleSelectPackage(pkg.id!)} className={styles.package}>
                        <div className='bg-zinc-100 p-4 rounded-lg'>
                            <strong>{pkg.name}</strong>
                            <div className='flex gap-4 text-zinc-400 text-sm'>
                                <p>
                                    <Users2 size={15} />
                                    {pkg.group_size}
                                </p>
                                <p>
                                    <Calendar size={15} />
                                    {pkg.duration_days}
                                </p>
                            </div>
                        </div>
                        <p>
                            <DollarSign size={15} />
                            {pkg.price}
                        </p>
                    </li>
                ))}
            </ul>
        }
    </>

}
export default PackagesList; { }