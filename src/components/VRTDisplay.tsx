import * as React from 'react';
import { useState, ReactElement } from 'react';
import { Image } from '@sprinklrjs/spaceweb/image';
import { Box } from '@sprinklrjs/spaceweb/box';
import { RadioGroup, Radio } from '@sprinklrjs/spaceweb/radio';
import { Modal, ModalBody } from '@sprinklrjs/spaceweb/modal';

type ShowType = 'changed' | 'unchanged' | 'all';

export type ImageType = {
  baseImageSrc: string;
  currentImageSrc: string;
  diffImageSrc: string;
  fileName: string;
};

export const VRTDisplay = ({ images }: { images: ImageType[] }): ReactElement => {
  const [showType, setShowType] = useState<ShowType>('changed');
  const [imageUrl, setImageUrl] = useState('');
  const isOpen = Boolean(imageUrl);

  const filteredImages = images.filter(image => showType === 'all' ? true : !!image.diffImageSrc)

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
          {filteredImages
            .map((image: ImageType, imageNo: number) => (
              <Box
                className="px-4 flex justify-center items-center h-64 text-11 font-bold"
                style={{ width: '100%', height: '80vh' }}
                key={image.fileName}
              >
                {imageNo + 1}. {image.fileName}
              </Box>
            ))}
        </Box>

        <Box className="flex flex-col w-6/24 gap-6">
          <Box className="flex justify-center text-11 font-bold">Baseline</Box>
          {filteredImages
            .map((image: ImageType) => (
              <Box
                onClick={() => openPopUp(image.baseImageSrc)}
                className="overflow-y-hidden hover:cursor-pointer"
                style={{ width: '100%', height: '80vh' }}
                key={image.fileName}
              >
                <Image src={image.baseImageSrc} alt={image.fileName} className="object-contain h-full w-full" />
              </Box>
            ))}
        </Box>

        <Box className="flex flex-col w-6/24 gap-6">
          <Box className="flex justify-center text-11 font-bold">Current</Box>
          {filteredImages
            .map((image: ImageType) => (
              <Box
                onClick={() => openPopUp(image.currentImageSrc)}
                key={image.fileName}
                className="overflow-y-hidden hover:cursor-pointer"
                style={{ width: '100%', height: '80vh' }}
              >
                <Image src={image.currentImageSrc} alt={image.fileName} className="object-contain h-full w-full" />
              </Box>
            ))}
        </Box>

        <Box className="flex flex-col w-6/24 gap-6">
          <Box className="flex justify-center text-11 font-bold">Difference</Box>
          {filteredImages
            .map((image: ImageType) => {
              if (showType !== 'changed') {
                return <Box style={{ width: '100%', height: '80vh' }} key={1} />;
              } else {
                return (
                  <Box
                    onClick={() => openPopUp(image.diffImageSrc)}
                    key={image.fileName}
                    className="overflow-y-hidden hover:cursor-pointer"
                    style={{ width: '100%', height: '80vh' }}
                  >
                    <Image src={image.diffImageSrc} alt={image.fileName} className="object-contain h-full w-full " />
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
              <Radio value="all">All</Radio>
              <Radio value="changed">Failed</Radio>
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
