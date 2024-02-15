import styled from "styled-components"

export const WrapperHeaderUser = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 20px
`

export const WrapperInfoUser = styled.div`
  .name-info {
    font-size: 1.6rem;
    color: rgb(36, 36, 36);
    font-weight: 600;
    text-transform: uppercase;
  }
  .address-info,.phone-info,.delivery-info,.delivery-fee,.payment-info {
    color: rgba(0, 0, 0, 0.65);
    font-size: 1.4rem;
    margin-top: 8px;
  }
  .name-delivery {
    color: rgb(234, 133, 0); 
    font-weight: 600;
    text-transform: uppercase;
    font-size: 1.6rem;
  }
  .status-payment {
    margin-top: 8px;
    font-weight: 600;
    color: var(--popular-color); 
  }
`

export const WrapperLabel = styled.div`
  color: rgb(36, 36, 36);
  font-size: 1.6rem;
  font-weight: 600;
  margin-bottom: 15px;
`
export const WrapperContentInfo = styled.div`
  height: 118px;
  width: 320px;
  background-color: #fff;
  border-radius: 6px;
  padding: 10px;
`

export const WrapperStyleContent = styled.div`
  display:flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 20px;
`

export const WrapperProduct = styled.div`
  display:flex;
  align-items:flex-start;
  margin-top: 10px;
`

export const WrapperNameProduct = styled.div`
  display:flex;
  align-items: flex-start;
  width: 670px;
`

export const WrapperItem = styled.div`
  width: 200px;
  font-weight: 600;
  &:last-child {
    color: red
  }
`
export const WrapperItemLabel = styled.div`
  width: 200px;
  font-weight: 600;
`

export const WrapperAllPrice = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`