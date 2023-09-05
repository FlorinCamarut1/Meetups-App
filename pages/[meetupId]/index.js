import MeetupDetails from "@/components/meetups/MeetupDetails";
import React from "react";
import { MongoClient, ObjectId } from "mongodb";
import Head from "next/head";
const MeetupPage = (props) => {
  return (
    <>
      <Head>
        <title>{props.meetupData.title}</title>
        <meta name="description" content={props.meetupData.description} />
      </Head>
      <MeetupDetails
        image={props.meetupData.image}
        title={props.meetupData.title}
        address={props.meetupData.address}
        description={props.meetupData.description}
      />
    </>
  );
};
export async function getStaticPaths() {
  const client = await MongoClient.connect(
    "mongodb+srv://florincamarut:hrYFwiWRmULQK4VY@cluster0.ph4o77k.mongodb.net/meetups?retryWrites=true&w=majority"
  );
  const db = client.db();
  const meetupsCollection = db.collection("meetups");
  const meetups = await meetupsCollection.find({}, { _id: 1 }).toArray();
  client.close();
  return {
    fallback: false,
    paths: meetups.map((meetup) => ({
      params: {
        meetupId: meetup._id.toString(),
      },
    })),
  };
}
export async function getStaticProps(context) {
  //fetch data from a single meet-up
  const client = await MongoClient.connect(
    "mongodb+srv://florincamarut:hrYFwiWRmULQK4VY@cluster0.ph4o77k.mongodb.net/meetups?retryWrites=true&w=majority"
  );
  const db = client.db();
  const meetupId = context.params.meetupId;
  const meetupsCollection = db.collection("meetups");
  const selectedMeetup = await meetupsCollection.findOne({
    _id: new ObjectId(meetupId),
  });
  client.close();
  return {
    props: {
      meetupData: {
        id: selectedMeetup._id.toString(),
        title: selectedMeetup.title,
        address: selectedMeetup.address,
        image: selectedMeetup.image,
        description: selectedMeetup.description,
      },
    },
  };
}

export default MeetupPage;
