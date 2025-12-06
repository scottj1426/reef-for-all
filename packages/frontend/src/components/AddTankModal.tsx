import { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  VStack,
  Select,
  useToast,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react';
import { tankApi } from '../api/tank.api';

interface AddTankModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  token: string;
  onTankAdded?: () => void;
}

export default function AddTankModal({ isOpen, onClose, userId, token, onTankAdded }: AddTankModalProps) {
  const [name, setName] = useState('');
  const [size, setSize] = useState<number>(0);
  const [type, setType] = useState('reef');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleSubmit = async () => {
    if (!name || !size) {
      toast({
        title: 'Validation Error',
        description: 'Name and size are required',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      setLoading(true);
      await tankApi.createTank(
        {
          name,
          size,
          type,
          description: description || undefined,
          imageUrl: imageUrl || undefined,
          userId,
        },
        token
      );

      toast({
        title: 'Tank created',
        description: 'Your tank has been added successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      // Reset form
      setName('');
      setSize(0);
      setType('reef');
      setDescription('');
      setImageUrl('');

      // Notify parent
      if (onTankAdded) {
        onTankAdded();
      }

      onClose();
    } catch (error: any) {
      console.error('Error creating tank:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Failed to create tank',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add New Tank</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Tank Name</FormLabel>
              <Input
                placeholder="e.g., My Reef Tank"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Size (gallons)</FormLabel>
              <NumberInput
                min={1}
                value={size}
                onChange={(_, valueAsNumber) => setSize(valueAsNumber || 0)}
              >
                <NumberInputField placeholder="e.g., 75" />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>

            <FormControl>
              <FormLabel>Type</FormLabel>
              <Select value={type} onChange={(e) => setType(e.target.value)}>
                <option value="reef">Reef</option>
                <option value="fowlr">FOWLR (Fish Only With Live Rock)</option>
                <option value="freshwater">Freshwater</option>
                <option value="brackish">Brackish</option>
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>Description</FormLabel>
              <Textarea
                placeholder="Tell us about your tank..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Image URL</FormLabel>
              <Input
                placeholder="https://example.com/tank-image.jpg"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
            </FormControl>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose} isDisabled={loading}>
            Cancel
          </Button>
          <Button colorScheme="blue" onClick={handleSubmit} isLoading={loading}>
            Add Tank
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
