<template>
  <v-container width="1400px" class="border flex flex-col gap-2">
    <v-form>
      <div class="flex gap-x-2 w-[450px] items-center">
        <v-date-input
          prepend-icon=""
          label="Transaction Date"
          density="compact"
          variant="outlined"
          color="primary"
          clearable
          flat
        ></v-date-input>
        <v-btn variant="outlined" color="primary">Search</v-btn>
        <v-btn variant="outlined" color="warning">Export</v-btn>
      </div>
    </v-form>
    <div class="overflow-x-auto">
      <v-data-table-virtual
        :headers="headers"
        :items="dataItems"
        density="compact"
        fixed-header
        class="min-w-max border rounded-sm text-xs"
      >
        <template
          v-for="col in headers"
          v-slot:[`header.${col.key}`]="{ column }"
          :key="col.key"
        >
          <span
            class="text-xs font-semibold"
            :class="{
              'text-left': col.align === 'start',
              'text-center': col.align === 'center',
              'text-right': col.align === 'end',
            }"
            >{{ column.title }}</span
          >
        </template>

        <template v-slot:item="{ item, columns }">
          <tr>
            <td
              v-for="col in columns"
              :key="col.key"
              class="text-xs"
              :class="{
                'text-left': col.align === 'start',
                'text-center': col.align === 'center',
                'text-right': col.align === 'end',
              }"
            >
              {{ item[col.key] }}
            </td>
          </tr>
        </template>

        <!-- Sum Row -->
        <template v-slot:body.append>
          <tr class="bg-gray-100 font-bold">
            <td
              v-for="(col, idx) in headers"
              :key="col.key"
              class="text-xs"
              :class="{
                'text-left': col.align === 'start',
                'text-center': col.align === 'center',
                'text-right': col.align === 'end',
              }"
            >
              <!-- Show "Total" in first column, sum for numeric columns, blank otherwise -->
              <!-- <span v-if="idx === 0">Total</span>
              <span v-else-if="isSumColumn(col.key)">
                {{ sumColumn(col.key) }}
              </span> -->
              <span>hello</span>
            </td>
          </tr>
        </template>
      </v-data-table-virtual>
    </div>
  </v-container>
</template>

<script>
import Items from "~/data/json/gstrr003.json";

export default {
  data() {
    return {
      headers: [
        {
          title: "Account Number",
          align: "start",
          key: "account_no",
        },
        { title: "Account Name", align: "start", key: "name_en" },
        { title: "Account Type", align: "start", key: "account_type" },
        { title: "Account Class", align: "center", key: "account_class" },
        { title: "Currency", align: "center", key: "currency" },
        { title: "Available Balance Dr", align: "end", key: "avail_dr" },
        { title: "Available Balance Cr", align: "end", key: "avail_cr" },
        { title: "Uncome Balance Dr", align: "end", key: "pending_buy" },
        { title: "Uncome Balance Cr", align: "end", key: "pending_sell" },
        { title: "Ledger Balance Dr", align: "end", key: "ledger_dr" },
        { title: "Ledger Balance Cr", align: "end", key: "total_settle" },
        {
          title: "Short Selling Proceeds Being Withheld",
          align: "end",
          key: "short_sell",
        },
        { title: "Trust Balance Dr", align: "end", key: "trust_bl_dr" },
        { title: "Trust Balance Cr", align: "end", key: "trust_avail_cr" },
        { title: "Uncheck Balance", align: "end", key: "unckeck_bl" },
        { title: "Net Trust Balance Dr", align: "end", key: "net_trust_dr" },
        { title: "Net Trust Balance Cr", align: "end", key: "net_trust_cr" },
        { title: "Proprietary Account", align: "center", key: "prop_account" },
      ],

      dataItems: [],
      //   dataItems: [
      //     {
      //       account_no: "1-2310000029-1",
      //       name_en: "Testonetwo Wealthtest",
      //       account_type: "CASH",
      //       account_class: "CUSTOMER",
      //       currency: "THB",
      //       avail_dr: "0",
      //       avail_cr: "2,000,000.0",
      //       pending_buy: "0",
      //       pending_sell: "0",
      //       ledger_dr: "0",
      //       total_settle: "2,000,000.0",
      //       short_sell: "0",
      //       trust_bl_dr: "2,000,000.0",
      //       trust_avail_cr: "2,000,000.0",
      //       unckeck_bl: "0",
      //       net_trust_dr: "0",
      //       net_trust_cr: "2,000,000.0",
      //       prop_account: "N",
      //       datetime: false,
      //     },
      //   ],
    };
  },
  mounted() {
    this.dataItems = Items.dataList;
  },
};
</script>

<style lang="scss" scoped></style>
