import React from 'react'
import Link from 'next/link'
import { Doctors } from '@/constants';
import Image from 'next/image';
import { getAppointment } from '@/lib/actions/appointment.actions';
import { formatDateTime } from '@/lib/utils';
import { Button } from '@/components/ui/button';

import * as Sentry from '@sentry/nextjs'
import { getUser } from '@/lib/actions/patient.action';


const Success  = async ({params: { userId},searchParams}:SearchParamProps) => {

  const appointmentId=(searchParams?.appointmentId as string) ||'';
  const appointment=await getAppointment(appointmentId);44

  const doctor=Doctors.find((doc)=> doc.name === appointment.primaryPhysician)
  const user=await getUser(userId);
  Sentry.metrics.set("user_view_appointment-success",user.name);

  return (
    <div className="flex h-screen max-h-screen px-[5%]">
        Success
        <div className='success-img'>
            <Link href='/'>
            <Image
            src="/assets/icons/logo-full.svg"
            height={1000}
            width={1000}
            alt="logo"
            className="h-10 w-fit"

            />

            </Link>

            <section className='flex flex-col items-center'>
                <Image
                src="/assets/gifs/success.gif"
                height={300}
                width={280}
                alt="success"

                />
             


            <h2 className="header mb-6 max-w-[600px] text-center">
                Your <span className='text-green-500'> appointment request</span> has been successfully submitted!
            </h2>
            <p>We will be in touch shortly to confirm</p>
            </section>
            {/* another section for displaying the appointment details */}
            <section className='request-details'>
                <p>Requested Appointment details:</p>
                <div className='flex items-center gap-3'>
                    <Image
                    src={doctor?.image!}
                    alt="doctor"
                    width={100}
                    height={100}
                    className='size-6'
                    />
                    <p className='whitespace-nowrap'>Dr. {doctor?.name}</p>

                    

                </div>
                <div className='flex gap-2'>
                    <Image
                    src="/assets/icons/calender.svg"
                    height={24}
                    width={24}
                    alt="calendar"

                    />
                    <p>{formatDateTime(appointment.schedule).dateTime}</p>

                </div>
            </section>
            {/* we have put aschild property in the button tag cause we will be putting a link inside it */}
            <Button variant="outline" className="shad-primary-btn" asChild>
                <Link href={`/patients/${userId}/new-appointment`}>
                New Appointment
                </Link>
            </Button>

            <p className='copyright'>
            © 2024 Carepulse 
            </p>




        </div>
     </div>
  )
}

export default Success 