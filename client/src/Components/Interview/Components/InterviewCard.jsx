import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import { getRandomInterviewCover } from '../Lib/utils';
import { Button, DisplayTechIcons } from '@/Components';
import { icons } from '@/Assets/icons';

export default function InterviewCard({ interview }) {
    const { id, role, type, techstack, createdAt, description } = interview;
    const formattedDate = dayjs(createdAt).format('MMM D, YYYY');
    const feedback = JSON.parse(
        localStorage.getItem(`interview-${id}-feedback`)
    );

    return (
        <div className="relative min-w-[280px] max-sm:w-full bg-[#f9f9f9] rounded-xl overflow-hidden border border-gray-200 shadow-sm">
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#4977ec] to-blue-700"></div>
            <div className="absolute -top-10 -right-10 w-20 h-20 rounded-full bg-blue-500/10 blur-xl"></div>
            <div className="absolute -bottom-10 -left-10 w-24 h-24 rounded-full bg-blue-600/10 blur-xl"></div>

            <div className="p-4 relative z-10">
                <div>
                    {/* Type Badge */}
                    <div className="text-[#4977ec] font-medium text-sm absolute top-4 right-4 w-fit px-3 py-1 rounded-full border border-[#4977ec] shadow-sm">
                        {type}
                    </div>

                    {/* Cover Image */}
                    <img
                        src={getRandomInterviewCover()}
                        alt="cover-image"
                        className="rounded-full object-cover size-16 drop-shadow-sm"
                    />

                    {/* Interview Role */}
                    <h3 className="mt-4 capitalize text-gray-800 font-semibold text-xl">
                        {role} Interview
                    </h3>

                    {/* Date & Score */}
                    <div className="flex flex-row align-items-center gap-5 mt-3 text-gray-800">
                        <div className="flex flex-row gap-2 items-center">
                            <div className="fill-[#202020] size-4">
                                {icons.date}
                            </div>
                            <p className="text-sm">{formattedDate}</p>
                        </div>
                    </div>

                    <div className="border-gray-200 border rounded-lg p-2 mt-4 bg-[#f6f6f6] text-gray-700 text-sm line-clamp-2 h-[54px]">
                        {feedback?.finalAssessment || description}
                    </div>
                </div>

                <div className="flex justify-between items-center mt-4 border-t-[0.09rem] border-gray-200 pt-4">
                    <DisplayTechIcons techStack={techstack} />

                    <Button
                        defaultStyles={true}
                        className="py-[5px] w-fit px-3 text-white"
                        btnText={
                            <Link
                                to={
                                    feedback?.finalAssessment
                                        ? `/interview/${id}/feedback`
                                        : `/interview/${id}`
                                }
                                className="flex items-center gap-1"
                            >
                                {feedback?.finalAssessment
                                    ? 'View Feedback'
                                    : 'Take Interview'}
                                <div className="fill-white size-3 ml-1">
                                    {icons.rightArrow}
                                </div>
                            </Link>
                        }
                    />
                </div>
            </div>
        </div>
    );
}
