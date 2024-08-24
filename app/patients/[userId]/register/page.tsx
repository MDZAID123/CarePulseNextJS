import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { RegisterForm } from '@/components/forms/RegisterForm'
import { getUser } from '@/lib/actions/patient.action'

import * as Sentry from '@sentry/nextjs'
const Registration = async ({params : { userId } }: SearchParamProps) => {

    const user=await getUser(userId);
    //here we can simply paste the sentry metrics
    Sentry.metrics.set("user_view_register",user.name);
    //this way we can add our users to a user view 

    //which will help us to allow how many users have viewed the register page
  console.log("user from registrstion page.tsx component\n")
  console.log(user)
  
  return (
    <div className="flex h-screen max-he-screen">

    

    <section className=" remove-scrollbar container my-auto">
      <div className="sub-container max-w-[860px] flex-1 flex-col py-10">

        <Image
        src="/assets/icons/logo-full.svg"
        height={1000}
        width={1000}
        alt="patient"
        className="mb-12 h-10 w-fit"
        />

        <RegisterForm user={user}/>

        {/* <PatientForm/> */}
          <p className="copyright py-12">

        © 2024 Carepulse 
          </p>
        <div  className="text-14-regular mt-20 flex justify-between">

          <Link href="/?admin=true" className="text-green-500">
          Admin
          </Link>

        </div>


      </div>

    </section>
    <Image
      src="/assets/images/register-img.png"
      height={1000}
      width={1000}
      alt="patient"
      className="side-img max-w-[390px]"

    />
    
  </div>
  )
}

export default Registration