import * as React from 'react';
import { useState, ReactElement } from 'react';
import { Image } from '@sprinklrjs/spaceweb/image';
import imgArr from '@/internals/data/display-data.json';
import { Box } from '@sprinklrjs/spaceweb/box';
import { RadioGroup, Radio } from '@sprinklrjs/spaceweb/radio';
import { Modal, ModalBody } from '@sprinklrjs/spaceweb/modal';

type ImageType = {
  srcBase: string;
  srcCur: string;
  srcDiff: string;
  showType: string;
  alt: string;
};

type ShowType = 'changed' | 'unchanged' | 'all';

function shouldDisplay(objShowType: string, showType: ShowType): boolean {
  if (showType === 'all') return true;
  return objShowType === showType;
}

export const VRTDisplay = (): ReactElement => {
  const [showType, setShowType] = useState<ShowType>('changed');
  const [imageUrl, setImageUrl] = useState('');
  const isOpen = Boolean(imageUrl);

  const openPopUp = (source: string): void => {
    setImageUrl(source);
  };

  const closePopUp = (): void => {
    setImageUrl('');
  };

  return (
    <>
      <Box className="p-4 flex border-1 border-solid spr-focus-01 gap-4">
        <Box className="flex flex-col w-2/24 gap-6">
        <Box className="flex justify-center text-11 font-bold">Path</Box>
          {imgArr
            .filter((obj: ImageType) => shouldDisplay(obj.showType, showType))
            .map((obj: ImageType, imageNo: number) => (
              <Box className="px-4 flex justify-center items-center h-64 text-11 font-bold" style={{width:"100%",height:"80vh"}} key={obj.alt}>
                {imageNo + 1}. {obj.alt}
              </Box>
            ))}
        </Box>

        <Box className="flex flex-col w-6/24 gap-6">
        <Box className="flex justify-center text-11 font-bold">Baseline</Box>
          {imgArr
            .filter((obj: ImageType) => shouldDisplay(obj.showType, showType))
            .map((obj: ImageType) => (
              <Box onClick={() => openPopUp(obj.srcBase)} className="overflow-y-hidden hover:cursor-pointer" style={{width:"100%",height:"80vh"}} key={obj.alt}>
                <Image src={obj.srcBase} alt={obj.alt} className="object-contain h-full w-full" />
              </Box>
            ))}
        </Box>

        <Box className="flex flex-col w-6/24 gap-6">
        <Box className="flex justify-center text-11 font-bold">Current</Box>
          {imgArr
            .filter((obj: ImageType) => shouldDisplay(obj.showType, showType))
            .map((obj: ImageType) => (
              <Box onClick={() => openPopUp(obj.srcCur)} key={obj.alt}className="overflow-y-hidden hover:cursor-pointer" style={{width:"100%",height:"80vh"}}>
                <Image src={obj.srcCur} alt={obj.alt} className="object-contain h-full w-full"/>
              </Box>
            ))}
        </Box>

        <Box className="flex flex-col w-6/24 gap-6">
        <Box className="flex justify-center text-11 font-bold">Difference</Box>
          {imgArr
            .filter((obj: ImageType) => shouldDisplay(obj.showType, showType))
            .map((obj: ImageType) => {
              if (obj.showType !== 'changed') {
                return <Box style={{width:"100%",height:"80vh"}}/>;
              } else {
                return (
                  <Box onClick={() => openPopUp(obj.srcDiff)} key={obj.alt} className="overflow-y-hidden hover:cursor-pointer" style={{width:"100%",height:"80vh"}}>
                    <Image src={obj.srcDiff} alt={obj.alt} className="object-contain h-full w-full " />
                  </Box>
                );
              }
            })}
        </Box>

        <Box className="w-3/24 ml-auto">
          <Box className="flex">
            <RadioGroup
              value={showType}
              intent="default"
              onChange={(e: any) => {
                setShowType(e.target.value as ShowType);
              }}
              name="number"
              align="vertical"
            >
              <Radio value="changed">Failed</Radio>
              <Radio value="unchanged">Successful</Radio>
              <Radio value="all">All</Radio>
            </RadioGroup>
          </Box>
        </Box>
      </Box>

      <Modal size="lg" onClose={closePopUp} isOpen={isOpen}>
        <ModalBody>
          <Image src={imageUrl} alt="Loading" className="w-full h-full" />
        </ModalBody>
      </Modal>
    </>
  );
};
