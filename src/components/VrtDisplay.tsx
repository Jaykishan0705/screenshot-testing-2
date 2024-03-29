import * as React from 'react';
import { useState } from 'react';
import { Image } from '@sprinklrjs/spaceweb/image';
import imgArr from '../../internals/data/display-data.json';
import { Box } from '@sprinklrjs/spaceweb/box';
import { RadioGroup, Radio } from '@sprinklrjs/spaceweb/radio';
import { Modal, ModalBody } from '@sprinklrjs/spaceweb/modal';

type ImageType = {
  srcBase: string;
  srcCur: string;
  srcDiff: string;
  showType: 'changed' | 'unchanged';
  alt: string;
};

type ShowType = 'changed' | 'unchanged' | 'all';

function shouldDisplay(objShowType: 'changed' | 'unchanged', showType: ShowType): boolean {
  if (showType === 'all') return true;
  return objShowType === showType;
}

const VRTDisplay = () => {
  const [showType, setShowType] = useState<ShowType>('changed');
  const [imageUrl, setImageUrl] = useState('');
  const isOpen = Boolean(imageUrl);

  function openPopUp(source: string) {
    setImageUrl(source);
  }

  function closePopUp() {
    setImageUrl('');
  }

  return (
    <>
      <Box className="p-4 flex border-1 spr-focus-01 border-solid">
        <Box className="w-2/24">
          {imgArr.map((obj: ImageType, imageNo: number) => {
            if (shouldDisplay(obj.showType, showType)) {
              return (
                <Box className="p-4 h-64 text-11 font-bold border-1 spr-border-04">
                  {imageNo + 1}. {obj.alt}
                </Box>
              );
            }
          })}
        </Box>

        <Box className="w-6/24">
          {imgArr.map((obj: ImageType) => {
            if (shouldDisplay(obj.showType, showType)) {
              return (
                <Box onClick={() => openPopUp(obj.srcBase)} className="pt-3 h-64 border-1 spr-border-04">
                  <Image src={obj.srcBase} alt={obj.alt} className={{ height: '230px', margin: 'auto' }} />
                </Box>
              );
            }
          })}
        </Box>

        <Box className="w-6/24">
          {imgArr.map((obj: ImageType) => {
            if (shouldDisplay(obj.showType, showType)) {
              return (
                <Box onClick={() => openPopUp(obj.srcCur)} className="pt-3 h-64 border-1 spr-border-04">
                  <Image src={obj.srcCur} alt={obj.alt} className={{ height: '230px', margin: 'auto' }} />
                </Box>
              );
            }
          })}
        </Box>

        <Box className="w-6/24">
          {imgArr.map((obj: ImageType) => {
            if (shouldDisplay(obj.showType, showType)) {
              if (obj.showType !== 'changed') {
                return <Box className="h-64 border-1 spr-border-04" />;
              } else {
                return (
                  <Box onClick={() => openPopUp(obj.srcDiff)} className="pt-3 h-64 border-1 spr-border-04">
                    <Image src={obj.srcDiff} alt={obj.alt} className={{ height: '230px', margin: 'auto' }} />
                  </Box>
                );
              }
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

export default VRTDisplay;
