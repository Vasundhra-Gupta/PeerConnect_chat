import { BasicRTE, Button } from '@/Components';
import { icons } from '@/Assets/icons';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { resumeService } from '@/Services';
import { useResumeContext } from '@/Context';
import Input from '@/Components/General/Input';
import { formatDateField } from '@/Utils';
import ReviewButton from '../ReviewButton';

export default function Experience() {
    const { resumeId } = useParams();
    const { resumeInfo, setResumeInfo, emptyResume, setSectionSaved } =
        useResumeContext();
    const [disabled, setDisabled] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e, index) => {
        const { name, value } = e.target;

        if (name === 'state' || name === 'country') {
            setResumeInfo((prev) => ({
                ...prev,
                experience: prev.experience.map((item, i) =>
                    i === index
                        ? {
                              ...item,
                              address: { ...item.address, [name]: value },
                          }
                        : item
                ),
            }));
        } else {
            const isDateField = name === 'startDate' || name === 'endDate';
            const processedValue = isDateField
                ? value
                    ? new Date(value).toISOString()
                    : ''
                : value;
            setResumeInfo((prev) => ({
                ...prev,
                experience: prev.experience.map((item, i) =>
                    i === index
                        ? {
                              ...item,
                              [name]: processedValue,
                          }
                        : item
                ),
            }));
        }
    };

    const addNewExperience = () => {
        setResumeInfo((prev) => ({
            ...prev,
            experience: [...prev.experience, emptyResume.experience[0]],
        }));
        setResumeInfo((prev) => ({ ...prev, enableNext: true }));
    };

    const removeExperience = () => {
        setResumeInfo((prev) => ({
            ...prev,
            experience: prev.experience.slice(0, -1),
        }));
    };

    const requiredFields = ['position', 'company', 'startDate', 'endDate'];
    function handleMouseOver() {
        if (
            resumeInfo.experience.some((exp) => {
                const hasEmptyRequiredFields = Object.entries(exp).some(
                    ([key, value]) => !value && requiredFields.includes(key)
                );
                const isAddressValid =
                    !exp.address ||
                    !exp.address?.state ||
                    !exp.address?.country;
                return isAddressValid || hasEmptyRequiredFields;
            })
        ) {
            setDisabled(true);
        } else {
            setDisabled(false);
        }
    }

    async function onSave(e) {
        try {
            e.preventDefault();
            setLoading(true);
            setDisabled(true);
            const res = await resumeService.saveSection(
                'experience',
                resumeId,
                resumeInfo.experience
            );
            if (res && !res.message) {
                toast.success('Experience updated!');
                setSectionSaved((prev) => ({ ...prev, experience: true }));
            }
        } catch (err) {
            toast.error('Failed to update experience.');
        } finally {
            setLoading(false);
            setDisabled(false);
        }
    }

    const handleApplySuggestions = (suggestions, index) => {
        setResumeInfo((prev) => ({
                ...prev,
                experience: prev.experience.map((item, i) =>
                    i === index ? {...item, description: suggestions.improved} : item
                ),
            }));
    };

    return (
        <div className="p-5 shadow-sm rounded-lg border-t-[#4977ec] border-t-4 border border-gray-200">
            <h2 className="font-bold text-lg">Professional Experience</h2>
            <p className="text-gray-400 text-sm italic mt-1">
                Add your previous job experience
            </p>

            <form onSubmit={onSave}>
                {resumeInfo.experience?.map((item, i) => (
                    <div key={i} className="my-5 rounded-lg">
                        <div className="grid grid-cols-2 gap-5">
                            <Input
                                label="Position"
                                name="position"
                                id="position"
                                required
                                placeholder="e.g., Software Engineer, Marketing Intern"
                                onChange={(e) => handleChange(e, i)}
                                value={item?.position}
                            />

                            <Input
                                label="Company"
                                name="company"
                                id="company"
                                required
                                placeholder="e.g., Infosys, Google, Deloitte"
                                onChange={(e) => handleChange(e, i)}
                                value={item?.company}
                            />

                            <Input
                                label="State"
                                name="state"
                                id="state"
                                required
                                placeholder="e.g., Panjab, California"
                                onChange={(e) => handleChange(e, i)}
                                value={item?.address.state}
                            />

                            <Input
                                label="Country"
                                name="country"
                                id="country"
                                required
                                placeholder="e.g., India, USA"
                                onChange={(e) => handleChange(e, i)}
                                value={item?.address.country}
                            />

                            <Input
                                label="Start Date"
                                type="date"
                                name="startDate"
                                id="startDate"
                                required
                                placeholder="Select start date"
                                onChange={(e) => handleChange(e, i)}
                                value={formatDateField(item?.startDate)}
                            />

                            <Input
                                label="End Date"
                                type="date"
                                id="endDate"
                                name="endDate"
                                required
                                placeholder="Select end date"
                                onChange={(e) => handleChange(e, i)}
                                value={formatDateField(item?.endDate)}
                            />

                            <div className="relative col-span-2 space-y-1">
                                <label className="block text-sm font-medium text-gray-800">
                                    Description
                                </label>
                                <div className="absolute -top-2 right-0 flex justify-between items-end">
                                    <ReviewButton 
                                        sectionName="experience description"
                                        content={item?.description || ''}
                                        onReviewComplete={(suggestions)=>handleApplySuggestions(suggestions, index)}
                                    />
                                </div>
                                <BasicRTE
                                    name="description"
                                    value={item?.description}
                                    onChange={(e) => handleChange(e, i)}
                                    placeholder="e.g., Worked on full-stack development, led a team of 3 interns, improved system performance by 20%"
                                />
                            </div>
                        </div>
                    </div>
                ))}

                <div className="flex justify-between items-center mt-4">
                    <div className="flex gap-2">
                        <Button
                            defaultStyles={true}
                            type="button"
                            variant="outline"
                            className="text-[15px] px-4 h-[30px] text-white"
                            onClick={addNewExperience}
                            btnText="+ Add More"
                        />
                        <Button
                            type="button"
                            variant="outline"
                            defaultStyles={true}
                            className="text-[15px] focus:ring-gray-500 text-black px-4 h-[30px] bg-gray-200 hover:bg-gray-300 rounded-lg"
                            onClick={removeExperience}
                            disabled={resumeInfo.experience.length === 0}
                            btnText="- Remove"
                        />
                    </div>
                    <Button
                        type="submit"
                        defaultStyles={true}
                        className="w-[60px] h-[30px] text-[15px] text-white"
                        disabled={disabled}
                        onMouseOver={handleMouseOver}
                        btnText={
                            loading ? (
                                <div className="flex items-center justify-center w-full">
                                    <div className="size-4 fill-[#4977ec] dark:text-[#f7f7f7]">
                                        {icons.loading}
                                    </div>
                                </div>
                            ) : (
                                'Save'
                            )
                        }
                    />
                </div>
            </form>
        </div>
    );
}
