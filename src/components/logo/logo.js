import PropTypes from 'prop-types';
import { memo } from 'react';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { useTheme } from '@mui/material/styles';
import { Box, Link } from '@mui/material';

// ----------------------------------------------------------------------

function Logo({ single = false, sx }) {
  const theme = useTheme();

  const PRIMARY_MAIN = theme.palette.primary.main;

  const singleLogo = (
    <svg width="58" height="64" viewBox="0 0 58 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5.28767 25.7842C7.70342 25.7842 9.66178 27.7425 9.66178 30.1583C9.66178 31.1198 9.85296 32.0728 10.2255 32.9635C10.5981 33.8542 11.1453 34.6664 11.8381 35.3524C12.5309 36.0385 13.3558 36.5851 14.2666 36.9587C15.1776 37.3323 16.1553 37.5252 17.1438 37.5252C18.1322 37.5252 19.11 37.3323 20.0209 36.9587C20.9318 36.5851 21.7566 36.0386 22.4495 35.3524C23.1423 34.6664 23.6895 33.8542 24.0621 32.9635C24.4346 32.0728 24.6258 31.1198 24.6258 30.1583C24.6258 27.7425 26.5842 25.7842 28.9999 25.7842C31.4157 25.7842 33.374 27.7425 33.374 30.1583C33.374 32.2805 32.9519 34.3809 32.1327 36.3392C31.3137 38.2975 30.1143 40.074 28.6052 41.5684C27.0961 43.0628 25.307 44.246 23.3409 45.0524C21.3749 45.8589 19.2693 46.2734 17.1438 46.2734C15.0183 46.2734 12.9126 45.8589 10.9467 45.0524C8.9806 44.246 7.19144 43.0628 5.68242 41.5684C4.17331 40.074 2.97392 38.2975 2.15484 36.3392C1.33573 34.3809 0.913574 32.2805 0.913574 30.1583C0.913574 27.7425 2.87193 25.7842 5.28767 25.7842Z"
        fill="#20505D"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M52.7121 25.7842C50.2964 25.7842 48.338 27.7425 48.338 30.1583C48.338 31.1198 48.1469 32.0728 47.7743 32.9635C47.4017 33.8542 46.8545 34.6664 46.1617 35.3524C45.4689 36.0385 44.644 36.5851 43.7332 36.9587C42.8222 37.3323 41.8445 37.5252 40.856 37.5252C39.8676 37.5252 38.8898 37.3323 37.9789 36.9587C37.068 36.5851 36.2432 36.0386 35.5503 35.3524C34.8575 34.6664 34.3103 33.8542 33.9377 32.9635C33.5652 32.0728 33.374 31.1198 33.374 30.1583C33.374 27.7425 31.4157 25.7842 28.9999 25.7842C26.5842 25.7842 24.6258 27.7425 24.6258 30.1583C24.6258 32.2805 25.048 34.3809 25.8671 36.3392C26.6862 38.2975 27.8855 40.074 29.3946 41.5684C30.9037 43.0628 32.6928 44.246 34.6589 45.0524C36.6249 45.8589 38.7305 46.2734 40.856 46.2734C42.9815 46.2734 45.0872 45.8589 47.0532 45.0524C49.0192 44.246 50.8084 43.0628 52.3174 41.5684C53.8265 40.074 55.0259 38.2975 55.845 36.3392C56.6641 34.3809 57.0862 32.2805 57.0862 30.1583C57.0862 27.7425 55.1279 25.7842 52.7121 25.7842Z"
        fill="#20505D"
      />
      <path
        d="M3.21573 27.6259C3.21573 26.6087 4.0403 25.7842 5.05746 25.7842H11.0431C12.0602 25.7842 12.8848 26.6087 12.8848 27.6259C12.8848 28.6431 12.0602 29.4676 11.0431 29.4676H5.05746C4.0403 29.4676 3.21573 28.6431 3.21573 27.6259Z"
        fill="#20505D"
      />
      <path
        d="M54.7841 27.6259C54.7841 26.6087 53.9595 25.7842 52.9424 25.7842H46.9567C45.9396 25.7842 45.115 26.6087 45.115 27.6259C45.115 28.6431 45.9396 29.4676 46.9567 29.4676H52.9424C53.9595 29.4676 54.7841 28.6431 54.7841 27.6259Z"
        fill="#20505D"
      />
      <path
        d="M9.77688 31.3094C9.77688 30.1061 10.5199 29.4676 11.2733 29.4676H9.20134L9.77688 31.3094Z"
        fill="#20505D"
      />
      <path
        d="M48.2229 31.3094C48.2229 30.1061 47.48 29.4676 46.7265 29.4676H48.7985L48.2229 31.3094Z"
        fill="#20505D"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M25.3165 41.8993V51.5683C25.3165 53.6027 26.9656 55.2518 28.9999 55.2518C31.0342 55.2518 32.6834 53.6027 32.6834 51.5683V41.8993H41.4316V51.5683C41.4316 58.4342 35.8657 64 28.9999 64C22.1341 64 16.5683 58.4342 16.5683 51.5683V41.8993H25.3165Z"
        fill="#20505D"
      />
      <path
        d="M32.8692 31.1069C31.172 34.1241 26.8278 34.1241 25.1306 31.1069L22.3616 26.1842C20.697 23.2249 22.8355 19.5683 26.2309 19.5683H31.7689C35.1643 19.5683 37.3028 23.2249 35.6382 26.1842L32.8692 31.1069Z"
        fill="#20505D"
      />
      <path
        d="M12.8848 4.60432C12.8848 2.06142 14.9462 0 17.4891 0C20.032 0 22.0934 2.06142 22.0934 4.60432V8.7482C22.0934 11.2911 20.032 13.3525 17.4891 13.3525C14.9462 13.3525 12.8848 11.2911 12.8848 8.7482V4.60432Z"
        fill="#20505D"
      />
      <path
        d="M35.9064 4.60432C35.9064 2.06142 37.9678 0 40.5107 0C43.0536 0 45.115 2.06142 45.115 4.60432V8.7482C45.115 11.2911 43.0536 13.3525 40.5107 13.3525C37.9678 13.3525 35.9064 11.2911 35.9064 8.7482V4.60432Z"
        fill="#20505D"
      />
    </svg>
  );

  const fullLogo = (
    <svg 
      xmlns="http://www.w3.org/2000/svg"
      width="104" 
      height="30"
      fill="none"
      viewBox="0 0 104 30"  
    >
      <path 
        fillRule="evenodd" 
        clipRule="evenodd" 
        d="M97.0896 22.9683C97.0896 23.49 97.4289 23.7969 98.231 23.7969L102.859 23.7969C103.661 23.7969 104 23.49 104 22.9683C104 22.4653 103.73 22.3563 103.423 22.2323C103.019 22.069 102.55 21.8797 102.55 20.7282V2.43899C102.55 0.781826 102.149 0.413574 101.439 0.413574C100.175 0.413574 96.8737 1.51831 96.8737 2.13209C96.8737 2.77263 97.2486 2.94352 97.6427 3.12317C98.0794 3.32219 98.5395 3.53194 98.5395 4.40292V20.7282C98.5395 21.8797 98.0708 22.069 97.6663 22.2323C97.3594 22.3563 97.0896 22.4652 97.0896 22.9683ZM28.7138 14.6677C28.7138 12.4662 28.5321 10.6929 25.8374 10.6929C23.8391 10.6929 22.6885 12.4051 22.6885 13.995V20.2935C22.6885 21.4408 23.1486 21.6294 23.5455 21.7922C23.8467 21.9157 24.1116 22.0243 24.1116 22.5255C24.1116 23.0453 23.7785 23.351 22.9913 23.351H18.4497C17.6624 23.351 17.3294 23.0453 17.3294 22.5255C17.3294 22.0243 17.5943 21.9157 17.8955 21.7922C18.2924 21.6294 18.7524 21.4408 18.7524 20.2935V12.8331C18.7524 11.4842 18.2391 11.2699 17.793 11.0838C17.4505 10.9409 17.1478 10.8145 17.1478 10.2036C17.1478 9.04172 20.4782 8.43027 21.0838 8.43027C21.9921 8.43027 22.1133 9.04172 22.1738 10.8763C23.506 9.31693 25.1409 8.43027 27.1696 8.43027C30.924 8.43027 32.6498 10.326 32.6498 14.423V20.2935C32.6498 21.4408 33.1098 21.6294 33.5068 21.7922C33.8079 21.9156 34.0728 22.0242 34.0728 22.5255C34.0728 23.0452 33.7398 23.351 32.9525 23.351H28.411C27.6238 23.351 27.2907 23.0453 27.2907 22.5255C27.2907 22.0242 27.5556 21.9156 27.8568 21.7922C28.2537 21.6294 28.7138 21.4408 28.7138 20.2935L28.7138 14.6677ZM13.8537 13.8618V20.4957C13.8537 21.3715 14.3411 21.6209 14.7625 21.8365C15.0835 22.0007 15.3662 22.1454 15.3662 22.5322C15.3662 23.211 15.1241 23.4887 13.9142 23.4887H11.5549C10.2844 23.4887 10.1634 22.8099 10.2239 21.8225H10.1029C9.256 23.1185 7.35033 23.7973 5.32373 23.7973C1.87541 23.7973 0 21.6373 0 19.2306C0 15.7361 3.85949 14.0392 7.66585 13.5692C8.20685 13.5024 8.6852 13.9222 8.6852 14.4673C8.6852 14.871 8.41266 15.2261 8.02121 15.325C5.625 15.9303 4.17428 17.6349 4.17428 19.1998C4.17428 20.6192 5.32371 22.0693 6.8966 22.0693C8.86274 22.0693 9.86087 20.1563 9.92136 18.6752L9.92049 13.4298H9.92136C9.92136 11.6402 8.89298 10.2825 6.8966 10.2825C5.63897 10.2825 4.98456 10.7782 4.36457 11.2478C3.80653 11.6705 3.27637 12.0721 2.35933 12.0721C1.63336 12.0721 1.02846 11.671 1.02846 10.8379C1.02846 9.35676 3.99273 8.43114 6.68484 8.43114C10.6474 8.43114 13.8537 9.91224 13.8537 13.8618ZM41.2608 9.67028C41.2608 9.15065 40.9581 8.87567 40.3226 8.87567H35.8734C35.1773 8.87567 34.9352 9.15065 34.9352 9.63973C34.9352 9.99406 35.1189 10.1344 35.3293 10.2951C35.5543 10.4671 35.8098 10.6623 35.9037 11.1678C35.9579 11.4841 36.0136 11.8558 36.0755 12.2687C36.6356 16.0051 37.7018 23.1176 42.7438 23.1176C42.986 23.1176 43.44 22.9954 43.894 22.8425C43.0768 24.8902 41.5644 26.5755 39.8686 26.9073C37.6797 27.3357 35.9887 26.6255 34.7703 26.1138L34.7702 26.1138C34.2339 25.8885 33.7892 25.7018 33.4338 25.6674C32.3941 25.5669 31.6231 26.1862 31.6231 27.3116C31.6231 29.1234 34.6954 29.6896 38.5271 29.5717C45.3227 29.3625 48.0102 20.5504 49.0392 12.3598C49.201 11.0522 49.7049 10.6187 50.0871 10.2899C50.3481 10.0653 50.5525 9.88949 50.5525 9.51741C50.5525 9.15065 50.3104 8.87567 49.705 8.87567H45.7705C45.2862 8.87567 45.1046 9.12009 45.1046 9.48685C45.1046 9.92648 45.447 10.1561 45.8241 10.409C46.2858 10.7187 46.7994 11.0632 46.7994 11.8707C46.7994 13.7044 45.7705 21.0394 43.8335 21.0394C41.5332 21.0394 40.2015 14.5296 40.2015 11.9318C40.2015 10.8343 40.5809 10.536 40.8856 10.2965C41.09 10.1358 41.2608 10.0016 41.2608 9.67028ZM71.5555 22.7486C71.5555 23.2684 71.8911 23.5742 72.6844 23.5742H77.2609C78.0542 23.5742 78.3897 23.2684 78.3897 22.7486C78.3897 22.2474 78.1228 22.1388 77.8193 22.0153C77.4194 21.8526 76.9558 21.664 76.9558 20.5166V13.5148C76.9558 9.9681 74.3014 8.6534 71.8606 8.6534C69.8774 8.6534 67.9553 9.20372 66.5518 11.0994C65.8195 9.54006 64.3245 8.6534 62.3413 8.6534C60.4497 8.6534 58.5582 9.44837 57.4598 11.0994H57.3988C57.3377 9.26485 57.2156 8.6534 56.3004 8.6534C55.6901 8.6534 52.334 9.26485 52.334 10.4267C52.334 11.0377 52.6392 11.164 52.9843 11.307C53.4337 11.4931 53.9511 11.7073 53.9511 13.0562V20.5166C53.9511 21.664 53.4875 21.8526 53.0875 22.0153C52.784 22.1388 52.5171 22.2474 52.5171 22.7486C52.5171 23.2684 52.8527 23.5742 53.646 23.5742H58.2225C59.0158 23.5742 59.3514 23.2684 59.3514 22.7486C59.3514 22.2474 59.0845 22.1388 58.781 22.0153C58.381 21.8526 57.9174 21.664 57.9174 20.5166V13.5454C57.9174 12.353 59.1683 10.916 61.0905 10.916C62.5855 10.916 63.4702 11.8332 63.4702 13.6678V20.5166C63.4702 21.664 63.0067 21.8526 62.6067 22.0153C62.3032 22.1388 62.0363 22.2474 62.0363 22.7486C62.0363 23.2684 62.3718 23.5742 63.1651 23.5742H67.7417C68.5349 23.5742 68.8706 23.2684 68.8706 22.7486C68.8706 22.2474 68.6037 22.1388 68.3001 22.0153C67.9001 21.8526 67.4366 21.664 67.4366 20.5166V13.5454C67.4366 12.353 68.6876 10.916 70.6097 10.916C72.1046 10.916 72.9895 11.8332 72.9895 13.6678V20.5166C72.9895 21.664 72.5259 21.8526 72.1259 22.0153C71.8224 22.1388 71.5555 22.2474 71.5555 22.7486ZM93.5797 20.7184V14.0845C93.5797 10.1349 90.3733 8.65384 86.4108 8.65384C83.7186 8.65384 80.7544 9.57946 80.7544 11.0606C80.7544 11.8937 81.3593 12.2948 82.0852 12.2948C83.0023 12.2948 83.5324 11.8932 84.0905 11.4705C84.7105 11.0009 85.3649 10.5052 86.6225 10.5052C88.6189 10.5052 89.6473 11.8629 89.6473 13.6525H89.6464L89.6473 18.8979C89.5868 20.379 88.5887 22.292 86.6225 22.292C85.0496 22.292 83.9002 20.8419 83.9002 19.4224C83.9002 17.8575 85.3509 16.153 87.7471 15.5477C88.1386 15.4488 88.4111 15.0937 88.4111 14.69C88.4111 14.1449 87.9328 13.7251 87.3918 13.7919C83.5854 14.2619 79.7259 15.9588 79.7259 19.4533C79.7259 21.86 81.6013 24.02 85.0496 24.02C87.0762 24.02 88.9819 23.3412 89.8288 22.0452H89.9498C89.8893 23.0326 90.0103 23.7114 91.2808 23.7114H93.6401C94.8501 23.7114 95.0921 23.4337 95.0921 22.7549C95.0921 22.3681 94.8094 22.2234 94.4884 22.0592C94.067 21.8435 93.5797 21.5942 93.5797 20.7184Z" fill="#162C37"
      />
    </svg>
  );

  return (
    <Link
      component={RouterLink}
      to="/"
      color="inherit"
      aria-label="go to homepage"
      sx={{ lineHeight: 0 }}
    >
      <Box
        sx={{
          width: single ? 75 : 104,
          lineHeight: 0,
          cursor: 'pointer',
          display: 'inline-flex',
          ...sx,
        }}
      >
        {single ? singleLogo : fullLogo}
      </Box>
    </Link>
  );
}

Logo.propTypes = {
  single: PropTypes.bool,
  sx: PropTypes.object,
};

export default memo(Logo);
