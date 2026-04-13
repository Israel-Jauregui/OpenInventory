import { StyleSheet, Modal } from 'react-native';

type CreateItemModalProps = {
    visible: boolean
};
export default function CreateItemModal({visible} : CreateItemModalProps) {

    return (<>

        <Modal
        visible={visible}
        >
        </Modal>

    </>);
}

const styles = StyleSheet.create(
    {

    });